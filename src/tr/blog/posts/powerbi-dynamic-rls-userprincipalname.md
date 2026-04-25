---
title: "Power BI'da 24 Farklı Role İçin Dynamic RLS — USERPRINCIPALNAME() Kullanım Kalıpları"
date: 2026-04-25
excerpt: "Statik RLS rolleri 24'e çıkınca yönetilemez hale gelir. Tek bir dynamic role ile USERPRINCIPALNAME() üzerinden güvenli ve sürdürülebilir bir yapı nasıl kurulur?"
trUrl: /tr/blog/powerbi-dynamic-rls-userprincipalname/
enUrl: /en/blog/
---

Power BI'da Row Level Security (RLS) ilk başlarda basittir: 2-3 rol oluşturursun, DAX filtre yazarsın, kullanıcıları workspace'te role atarsın. Ama satış organizasyonu büyüdükçe — 24 farklı bölge yöneticisi, her biri sadece kendi bölgesini görmeli — statik rol yaklaşımı çöker.

## Sorun: 24 statik rol = 24 ayrı bakım noktası

Her bölge için ayrı bir rol açıp ilgili filtre yazarsan:

- Yeni bölge geldiğinde model güncellemen gerekir
- Bir kullanıcı iki bölgeden sorumluysa iki role atanmalı
- Workspace assignment hataya açık (bir kişi yanlış role düşerse veri görür)

## Çözüm: Tek bir dynamic role + bir mapping tablosu

Modele bir `UserMapping` tablosu ekle:

```
UserPrincipalName       | Region
------------------------|--------
ahmet@firma.com         | Marmara
ayse@firma.com          | Ege
mehmet@firma.com        | Marmara
mehmet@firma.com        | Akdeniz
```

Bu tabloyu fact tablonla `Region` üzerinden ilişkilendir. Sonra bir tek role tanımla:

```dax
[Region] IN
CALCULATETABLE(
    VALUES(UserMapping[Region]),
    UserMapping[UserPrincipalName] = USERPRINCIPALNAME()
)
```

`USERPRINCIPALNAME()` — login olan kullanıcının e-postasını döner. `CALCULATETABLE` ile o kullanıcıya atanmış tüm bölgeleri çekip fact tabloyu o bölgelere göre filtreliyoruz.

## Test ederken dikkat

Power BI Desktop'ta "View as Roles" ile test ederken **mutlaka "Other user"** alanına gerçek bir UPN gir — yoksa `USERPRINCIPALNAME()` boş döner ve filtre tüm satırları gizler. Bu detay birçok ekibi yarım gün uğraştırır.

## Service tarafında ne değişir?

Service'te artık 24 ayrı rol assignment yok — tek bir "Dynamic" rolü var ve workspace'teki tüm kullanıcılar bu role atanır. Erişim kararı `UserMapping` tablosunda — yani veri ekibi (sen) yönetir, ID/Access ekibi değil.

`UserMapping`'i bir SQL view ya da Dataflow'la HR sisteminden besleyebilirsen artık "yeni bölge yöneticisi" haberi geldiğinde RLS güncellemesi diye bir iş kalmaz.

## Ne zaman bu yaklaşım yanlış?

Çok az rol varsa (2-3) statik RLS daha okunaklı ve debug'ı kolay. Bu pattern asıl değerini 10+ rol veya sürekli değişen organizasyonlarda gösterir.
