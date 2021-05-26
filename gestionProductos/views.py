import json
from django.shortcuts import render
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from .models import Product
# Vistas para renderizar

def index(request):

    return render(request,"gestionProductos/index.html")


def search(request):
    return render(request,"gestionProductos/search.html")



# API's

def search_api(request):
    product = request.GET.get('s','')
    print(product)
    result = Product.objects.filter(name__icontains=product).order_by('-price')
    #result = Product.objects.all()
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