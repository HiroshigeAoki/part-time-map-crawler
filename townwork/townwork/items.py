# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class Company(scrapy.Item):
    name = scrapy.Field()
    url = scrapy.Field()
    dateline = scrapy.Field()
    address = scrapy.Field()
    wages = scrapy.Field()
    job_title = scrapy.Field()
    is_A = scrapy.Field() # アルバイト[A]
    is_P = scrapy.Field() # パート[P]
    is_T = scrapy.Field() # 派遣社員[派]
    is_C = scrapy.Field() # 契約社員[契]
    is_F = scrapy.Field() # 正社員[社]
