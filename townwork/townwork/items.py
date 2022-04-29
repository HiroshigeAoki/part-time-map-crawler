# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class Company(scrapy.Item):
    name = scrapy.Field()
    name_u = scrapy.Field()
    url = scrapy.Field()
    deadline = scrapy.Field()
    address = scrapy.Field()
    wages = scrapy.Field()
    job_title = scrapy.Field()
    preferences = scrapy.Field()
    statuses = scrapy.Field()
    target = scrapy.Field()
    time = scrapy.Field()
