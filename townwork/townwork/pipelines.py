# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy.exceptions import DropItem
from pymongo import MongoClient

class ValidationPipline:
    def validate_item(self, item, spider):
        if not item['']:
            raise DropItem('Missing title')
    def drop_duplication(self, item, spider):
        if item: #TODO:後で書く。
            raise DropItem('Drop duplication')
        return item
    def calc_lat_loc(self, item, spider):
        if item['lat'] is None and item['loc'] is None:
            item['lat'] = '' #TODO: 後で
            item['loc'] = ''
        return item

class MongoPipeline:
    def open_spider(self, spider):
        self.client = MongoClient('localhost', 27017)
        self.db = self.client['scraping-book']
        self.collection = self.db['item']
    
    def close_spider(self, spider):
        self.client.close()
        
    def process_item(self, item, spider):
        self.collection.insert_one(dict(item))
        return item