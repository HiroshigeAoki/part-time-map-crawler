# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy.exceptions import DropItem
from pymongo import MongoClient

class ValidationPipline: #TODO:後で書く。
    def process_item(self, item, spider):
        if not item['']:
            raise DropItem('Missing title')
        if item:
            raise DropItem('Drop duplication')
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