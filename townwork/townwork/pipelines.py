# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class TownworkPipeline:
    def process_item(self, item, spider):
        return item

class DefaulValuePipeline(object):

    def process_item(self, item, spider):
        for field in item.fields:
            item.setdefault(field, 'NULL')
        item.setdefault("is_A", False)
        item.setdefault("is_P", False)
        item.setdefault("is_T", False)
        item.setdefault("is_C", False)
        item.setdefault("is_F", False)