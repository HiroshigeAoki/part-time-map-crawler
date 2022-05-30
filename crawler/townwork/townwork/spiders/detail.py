from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from geojson import Point
import json
import re
import datetime
from scrapy.shell import inspect_response
from bs4 import BeautifulSoup

from townwork.items import Company
import os, sys
sys.path.append(os.pardir)
from backend.organize_db import OrganizeDB

class DetailSpider(CrawlSpider):
    name = 'detail'
    allowed_domains = ['townwork.net']
    with open('urls.json') as f:
        start_urls =  list(json.load(f)[0].values())
        
    custom_settings = {
        'ITEM_PIPELINES': {
            #'townwork.pipelines.TownworkPipeline': 300,
            'townwork.pipelines.MongoPipeline': 800,
        }
    }
    
    # ignore existing urls in db.
    #deny = OrganizeDB().existing_urls()

    rules = [
        Rule(LinkExtractor(allow=r'(/\w+)+/\?page=\d+'), follow=True), # ページ遷移1~
        Rule(LinkExtractor(allow=[r'/detail/clc_\d+/joid_\w+/', r'/detail/clc_\d+/\?opf=\w+'], restrict_xpaths='//*[@id="jsi-content-wrapper"]/div'), callback='parse_detail') # 詳細ページをparse
    ]

    def parse_detail(self, response):
        item = Company()
        item["url"] = response.url
        item['name'] = BeautifulSoup(response.css('.jsc-company-txt').get()).getText().strip().replace('\u3000', ' ')
        preferences = BeautifulSoup(response.css('.job-detail-merit-inner').get()).getText().strip().split('\n')
        item['preferences'] = [p.replace('\n', '') for p in preferences if '\n' != p or '……' != p or p != '……\n']
        item['fetched_date'] = datetime.datetime.now()
        
        #inspect_response(response, self)
        dt_list = response.css('dt')
        for dt in dt_list:
            dt_value = dt.css('::text').get()
            if dt_value == '職種' and not 'job_title' in item.keys():
                item['job_title'] = BeautifulSoup(dt.xpath('./following-sibling::dd').get()).getText().strip()
            elif dt_value == '掲載期間' and not 'deadline' in item.keys():
                period = BeautifulSoup(dt.xpath('./following-sibling::dd').get()).getText().strip()
                item['deadline'] = datetime.datetime(*map(int, re.findall(r'～(\d+)年(\d+)月(\d+)日(\d+):(\d+)', period)[0]))
            elif dt_value == '会社住所' and not 'address' in item.keys():
                item['address'] = BeautifulSoup(dt.xpath('./following-sibling::dd').get()).getText().strip().replace('\u3000', ' ')
            elif dt_value == '給与' and not 'wages' in item.keys():
                item['wages'] = BeautifulSoup(dt.xpath('./following-sibling::dd').get()).getText().strip()
            elif dt_value == '対象となる方・資格' and not 'target' in item.keys():
                item['target'] = BeautifulSoup(dt.xpath('./following-sibling::dd').get()).getText().strip()
            elif dt_value == '勤務期間' and not 'working_hours' in item.keys():
                working_hours = BeautifulSoup(dt.xpath('./following-sibling::dd').get()).getText().strip()
                item['working_hours'] = working_hours.replace('……', ':').replace('\n\n\n', ', ').replace('\n', '')
            elif dt_value == '勤務地' and not 'lat' in item.keys() and not 'lon' in item.keys():
                a_tag = BeautifulSoup(dt.xpath('./following-sibling::dd').get()).find('a')
                if a_tag is None:
                    continue
                item['loc'] = Point((float(a_tag['data-lon']), float(a_tag['data-lat'])))

        item['statuses'] =  re.findall(r'\[.+?\]', item['job_title']) # 雇用形態

        yield item