from gc import callbacks
from http.client import ImproperConnectionState
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
import json
import re
from scrapy.shell import inspect_response


from townwork.items import Company

class DetailSpider(CrawlSpider):
    name = 'detail'
    allowed_domains = ['townwork.net']
    with open('urls.json') as f:
        start_urls =  list(json.load(f)[0].values())

    print(f'starg url: {start_urls}')

    rules = [
        Rule(LinkExtractor(allow=r'(/\w+)+/\?page=\d+'), follow=True), # ページ遷移1~
        Rule(LinkExtractor(allow=r'/detail/clc_\d+/', restrict_xpaths='//*[@id="jsi-content-wrapper"]/div'), callback='parse_detail') # 詳細ページをparse
    ]

    def parse_detail(self, response):
        item = Company()

        item["url"] = response.url
        #inspect_response(response, self)

        # 紹介画像無し
        if len(response.xpath('//*[@id="jsi-slideshow"]/div[1]/ul/li[1]/div[1]/img')) == 0:
            item["name"] = response.xpath('//*[@id="jsi-content-wrapper"]/div[3]/div/div[2]/div[1]/h3/text()').get().strip()
            item["dateline"] = response.xpath('//*[@id="jsi-content-wrapper"]/div[3]/div/div[2]/div[3]/div/div/p/text()').get().strip()
            item["wages"] = response.xpath('//*[@id="jsi-content-wrapper"]/div[3]/div/div[2]/div[2]/div[2]/div/dl[2]/dd/p/span/text()').get().strip()
            item["job_title"] = response.xpath('//*[@id="jsi-content-wrapper"]/div[3]/div/div[2]/div[2]/div[2]/div/dl[1]/dd/p/span/text()').get().strip()
            statuses =  re.findall(r'\[.+?\]', item['job_title']) # 雇用形態
            item['address'] = response.xpath('//*[@id="js-detailArea"]/div[10]/div/dl[1]/dd/p')

        # 紹介画像あり
        else:
            item["name"] = response.xpath('//*[@id="js-detailArea"]/div[1]/h3/span[2]/text()').get().strip()
            item["dateline"] = response.xpath('//*[@id="js-detailArea"]/div[3]/div/div/p/text()').get().strip()
            item["wages"] = response.xpath('//*[@id="js-detailArea"]/div[2]/div[2]/div[2]/dl[2]/dd/p/span/text()').get().strip()
            item["job_title"] = response.xpath('//*[@id="js-detailArea"]/div[2]/div[2]/div[2]/dl[1]/dd/p/span/text()').get().strip()
            statuses =  re.findall(r'\[.+?\]', item['job_title']) # 雇用形態
            item['address'] = response.xpath('//*[@id="js-detailArea"]/div[11]/div/dl[3]/dd/p')

        if '[Ａ]' in statuses:
            item["is_A"] = True # アルバイト[A]
        if '[Ｐ]' in statuses:
            item["is_P"] = True # パート[P]
        if '[派]' in statuses:
            item["is_T"] = True # 派遣社員[派]
        if '[契]' in statuses:
            item["is_C"] = True # 契約社員[契]
        if '[社]' in statuses:
            item["is_F"] = True # 正社員[社]

        yield item



