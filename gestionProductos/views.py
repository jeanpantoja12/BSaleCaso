import json
from django.shortcuts import render
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from .models import Product,Category
# Vistas para renderizar

def index(request):

    return render(request,"gestionProductos/index.html")


def search(request):
    return render(request,"gestionProductos/search.html")

def category_search(request):
    return render(request,"gestionProductos/category.html")

# API's

def search_api(request):
    product = request.GET.get('s','') 
    order = request.GET.get('order',None)
    if order is not None:
        if order == 'asc':
            result = Product.objects.filter(name__icontains=product).order_by('price')
        elif order == 'desc':
            result = Product.objects.filter(name__icontains=product).order_by('-price')
    else:
        result = Product.objects.filter(name__icontains=product).order_by('-price')
    paginator = Paginator(result, 10)
    actual_page = request.GET.get('page',1)
    print(actual_page)
    page = paginator.get_page(actual_page)
    return JsonResponse({
        "results": [result.serialize() for result in page],
        "num_pages": paginator.num_pages,
        "has_next": page.has_next(),
        "has_prev": page.has_previous(),
    })

def categories_api(request):
    categories = Category.objects.all()
    return JsonResponse({
        "categories": [category.serialize() for category in categories]     
    })

def categorysearch_api(request,cat,num):
    try:
        category = Category.objects.get(name=cat)
    except Category.DoesNotExist:
        return JsonResponse({"error": "Category not found."}, status=404)
    order = request.GET.get('order', None)
    if order is not None:
        if order == 'asc':
            results = Product.objects.filter(category=category).order_by('price')
        elif order == 'desc':
            results = Product.objects.filter(category=category).order_by('-price')
    else:
        results = Product.objects.filter(category=category).order_by('-price')
    print (order)
    paginator = Paginator(results, 8)
    page = paginator.get_page(num)
    return JsonResponse({
        "results": [result.serialize() for result in page],
        "has_next": page.has_next()
    })

