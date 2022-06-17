from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.http import HtmlResponse
from geojson import Point
import json
import re
import datetime
from scrapy.shell import inspect_response
from bs4 import BeautifulSoup

from townwork.items import Job
from crawler.organize_db import OrganizeDB

class DetailSpider(CrawlSpider):
    name = 'detail'
    allowed_domains = ['townwork.net']
    custom_settings = {
        'ITEM_PIPELINES': {
            'townwork.pipelines.MongoPipeline': 800,
        }
    }
    
    def __init__(self, *args, **kwargs):
        super(DetailSpider, self).__init__(*args, **kwargs)
        
        with open('json/urls.json') as f:
            urls =  list(json.load(f)[0].values())
            
        with open('json/category_dict.json') as f:
            category_dict = json.load(f)
        
        self.id2cat = {c['jmc_value']: c for c in category_dict.get('jmc')}
        
        self.jmc_list = category_dict.get('jmc')
        self.start_urls = []
        for url in urls:
            for jmc in self.jmc_list:
                self.start_urls.append(f"{url}jc_{jmc.get('jc_value')}/jmc_{jmc.get('jmc_value')}")

    # ignore existing urls in db.
    organizer = OrganizeDB()
    organizer.drop_expired()
    deny = organizer.existing_urls()

    rules = [
        Rule(LinkExtractor(allow=r'(/\w+)+/\?page=\d+')), # ページ遷移1~
        Rule(LinkExtractor(allow=[r'/detail/clc_\d+/joid_\w+/', r'/detail/clc_\d+/\?opf=\w+'], deny=deny, restrict_xpaths='//*[@class="job-lst-main-cassette-wrap"]'), callback='parse_detail') # 詳細ページをparse
    ]

    def _requests_to_follow(self, response):
        if not isinstance(response, HtmlResponse):
            return
        seen = set()
        jmc_id = re.findall(r'jmc_(\d+)', response.url)[0]
        jc_jmc = (
            dict(
                jc = self.id2cat.get(jmc_id).get('category'),
                jmc = self.id2cat.get(jmc_id).get('name')
            )
        )
        for rule_index, rule in enumerate(self._rules):
            links = [lnk for lnk in rule.link_extractor.extract_links(response)
                    if lnk not in seen]
            for link in rule.process_links(links):
                seen.add(link)
                request = self._build_request(rule_index, link)
                request.meta.update(jc_jmc)
                yield rule.process_request(request, response)

    def parse_detail(self, response):
        item = Job()
        #inspect_response(response, self)
        item["url"] = response.url
        item["jc"] = response.meta['jc']
        item["jmc"] = response.meta['jmc']
        item['name'] = BeautifulSoup(response.css('.jsc-company-txt').get(), features='lxml').getText().strip().replace('\u3000', ' ')
        preferences = BeautifulSoup(response.css('.job-detail-merit-inner').get(), features='lxml').getText().strip().split('\n')
        item['preferences'] = [p.replace('\n', '') for p in preferences if '\n' != p or '……' != p or p != '……\n']
        item['fetched_date'] = datetime.datetime.now()

        dt_list = response.css('dt')
        for dt in dt_list:
            dt_value = dt.css('::text').get()
            if dt_value == '職種' and not 'job_title' in item.keys():
                item['job_title'] = BeautifulSoup(dt.xpath('./following-sibling::dd').get(), features='lxml').getText().strip()
            elif dt_value == '掲載期間' and not 'deadline' in item.keys():
                period = BeautifulSoup(dt.xpath('./following-sibling::dd').get(), features='lxml').getText().strip()
                if period is None: # TODO: デバックする。
                    item['deadline'] = datetime.datetime.now()
                    continue
                item['deadline'] = datetime.datetime(*map(int, re.findall(r'～(\d+)年(\d+)月(\d+)日(\d+):(\d+)', period)[0]))
            elif dt_value == '会社住所' and not 'address' in item.keys():
                item['address'] = BeautifulSoup(dt.xpath('./following-sibling::dd').get(), features='lxml').getText().strip().replace('\u3000', ' ')
            elif dt_value == '給与' and not 'wages' in item.keys():
                item['wages'] = BeautifulSoup(dt.xpath('./following-sibling::dd').get(), features='lxml').getText().strip()
            elif dt_value == '対象となる方・資格' and not 'target' in item.keys():
                item['target'] = BeautifulSoup(dt.xpath('./following-sibling::dd').get(), features='lxml').getText().strip()
            elif dt_value == '勤務期間' and not 'working_hours' in item.keys():
                working_hours = BeautifulSoup(dt.xpath('./following-sibling::dd').get(), features='lxml').getText().strip()
                item['working_hours'] = working_hours.replace('……', ':').replace('\n\n\n', ', ').replace('\n', '')
            elif dt_value == '勤務地' and not 'lat' in item.keys() and not 'lon' in item.keys():
                a_tag = BeautifulSoup(dt.xpath('./following-sibling::dd').get(), features='lxml').find('a')
                if a_tag is None:
                    continue
                item['loc'] = Point((float(a_tag['data-lon']), float(a_tag['data-lat'])))

        statDic = {"[Ａ]": "アルバイト", "[Ｐ]": "パート", "[契]": "契約社員", "[社]": "正社員", "[派]": "派遣", "[委]": "業務委託"}
        item['statuses'] =  [statDic.get(stat) for stat in re.findall(r'\[.+?\]', item['job_title'])] # 雇用形態
        
        yield item