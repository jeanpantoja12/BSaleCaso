﻿# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Category(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'category'
    
    def serialize(self):
        return{
            "id": self.id,
            "nombre": self.name
        }

class Product(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    url_image = models.CharField(max_length=255, blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    discount = models.IntegerField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete= models.DO_NOTHING, db_column='category', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product'

    def serialize(self):
        return{
            "id": self.id,
            "nombre": self.name,
            "img": self.url_image,
            "precio": self.price,
            "desc": self.discount,
            "categoria": self.category.name
        }