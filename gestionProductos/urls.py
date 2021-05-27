from django.urls import path

from . import views

urlpatterns = [
    path("",views.index, name='index'),
    path("search", views.search, name='search'),
    path("category",views.category_search,name='category'),
    #API
    path("api/search", views.search_api, name='search_api'),
    path("api/categories",views.categories_api, name='categories_api'),
    path("api/categories/search/<str:cat>/<int:num>",views.categorysearch_api, name='categoriesearch_api')
]