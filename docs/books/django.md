# Letters on the Reasoned Web

### A Treatise on Django, from the Model in the Database to the Form in the Browser, in the Voice of Python

*In the manner of Euler's Letters to a German Princess*

---

## Preface

Dear Reader,

There is a kind of craftsperson whom every market knows but few celebrate. He is the carpenter who arrives with a single battered case of tools and, in an afternoon, builds a stall that will stand for thirty years. He does not need rare exotic woods, exotic fastenings, exotic finishes. He needs his planes, his chisels, his squares, his hammers, his glues. He has carried this case for a lifetime; the tools have been sharpened so many times that the steel is older than the youngest apprentice. He knows what each tool does, he knows what each tool is *for*, and he does not reach for a new one when an old one will do.

**Django** is the carpenter's case of Python web development. It is a framework that arrived in 2003, was named after a guitarist, and proposed something that — at the time — was almost considered impolite: that a single piece of software should ship with *everything you needed to build a serious website*. Not just routing. Not just templates. The database layer. The administrative interface. The forms. The authentication. The internationalization. The session management. The CSRF protection. The migrations. The shell. Everything in one case, one import, one consistent style, one well‑thumbed manual.

The slogan that crystallized this approach was: *"the framework for perfectionists with deadlines."* It described an unusual posture. Most frameworks ask the developer to choose between *fast* (a microframework with few opinions) and *complete* (an enterprise framework with many opinions). Django proposed both at once: complete enough to ship in a week, opinionated enough to remain consistent across teams, flexible enough to scale to Instagram.

The "batteries included" decision has aged extraordinarily well. Twenty‑two years after Django's first release, the framework still powers — among many others — Instagram (a billion users), Pinterest, Disqus, the Washington Post, NASA's main site, and an enormous fraction of African government tech and African startup back‑office systems. The carpenter's case has been refined for two decades, but the tools inside it remain recognizable. A developer who learned Django in 2010 can read a 2025 codebase and feel at home.

I shall explain Django to you in its entirety. We shall begin with the language it is built in — Python, whose particular qualities made Django possible — and we shall climb through every major battery of the framework: the model that maps Python classes to database tables, the URL router that turns requests into views, the template engine that turns views into HTML, the form layer that turns HTML into validated data, the famous admin that turns models into a working back‑office in fifteen seconds, the authentication system that turns users into typed entities with permissions, the REST framework that turns Django into a JSON API server, and the deployment topology that turns a local development project into a production service serving thousands of customers per second.

I will draw, as always, from the world beyond computing. The principle that a small set of well‑sharpened tools, used by a craftsperson who knows them deeply, can build almost anything, is the principle that ran the great African artisanal traditions for centuries. The blacksmith of Kano with his anvil and his bellows. The weaver of Bonwire with her loom and her thread. The boatbuilder of Lamu with his adze and his caulking. Each tradition resisted the temptation to acquire ever more specialized tools and instead deepened the mastery of a few. Django is a framework built in this tradition.

By the end of these letters, you will not merely know how to build a Django application. You will understand why Django chose to be complete rather than minimal, why Python chose to be readable rather than terse, and why the framework that powered the early web continues to power the working web of the 2020s. You will hold the carpenter's case.

Let us begin.

---

## Part I: The Soul of Python and Django

*On the language of clarity, on the framework's philosophy, and on the model‑template‑view triad*

---

### Letter 1: On Python and the Language of Clarity

Dear Reader,

A framework is shaped by the language it is built in. Rails is what it is because Ruby allows it. Express is what it is because JavaScript allows it. Django is what it is because Python allows it — and to understand Django, you must first hold Python clearly in your mind.

Python was created in 1991 by a Dutchman named Guido van Rossum. He had a small but consequential conviction: *programs are read more often than they are written, and therefore programs should be written to be read*. Everything about Python flows from this conviction. Indentation is significant — not as a curiosity but because the visual structure must match the logical structure. Names are spelled out — `length`, not `len`, except where convention has worn the longer form away. Side‑by‑side comparison is preferred to clever one‑liners.

Compare a small task in three languages.

```c
// C
for (int i = 0; i < n; i++) {
    if (arr[i] > max) max = arr[i];
}
```

```perl
# Perl
my $max = (sort { $b <=> $a } @arr)[0];
```

```python
# Python
max_value = max(arr)
```

The C version is explicit, mechanical. The Perl version is clever, dense, idiomatic — and unreadable to anyone who has not memorized Perl's sort idioms. The Python version uses a built‑in `max` function and reads like a sentence: "max_value is the maximum of arr." It is the closest a programming language has come to *prose*.

This is not a minor aesthetic choice. It is a productive one. Python code can be read by junior engineers, by data scientists who are not full‑time developers, by domain experts who learn programming after their thirtieth birthday. The language welcomes outsiders to the work. For a continent where many of the most consequential builders did not grow up at keyboards — researchers, agronomists, public‑health officials, government data officers — Python's accessibility is a gift. It is the language that has democratized programming as much as JavaScript has, but for a different audience.

Python has other properties that mattered for Django:

**It is dynamically typed.** A variable holds whatever value is assigned to it. This lets frameworks like Django define classes whose fields and methods are determined at *runtime* by the code that uses them. Django models work because Python permits this kind of metaprogramming.

**It is interpreted.** No compilation step. You write code, run it, see the result. This makes web development — where you are constantly running and reloading — feel fluid.

**It has a vast standard library.** "Batteries included" was Python's slogan before it was Django's. Strings, dates, JSON, HTTP clients, regex, math, statistics, sockets, threading, multiprocessing — all in the stdlib. You can build a great deal with only what ships in the box.

**It has a rich ecosystem.** PyPI — the Python Package Index — hosts hundreds of thousands of libraries. Want machine learning? PyTorch, scikit‑learn. Want data analysis? Pandas, NumPy. Want a Web API? Django. The ecosystem is unmatched in scientific computing and competitive in almost everything else.

For Django specifically, Python's three most enabling properties are:

1. **Decorators**, which let Django add behavior to functions and classes without modifying them.
2. **Metaclasses**, which let Django define models whose fields become database columns automatically.
3. **`__getattr__` and `__setattr__`**, which let Django models expose database fields as ordinary Python attributes.

You do not need to understand the deep magic to use Django. But knowing that Django is built on Python's *flexibility* helps explain why Django code looks the way it does — like ordinary Python that happens to also be a web application.

The parallel: the **Yoruba language** has a property that linguists call *tonal precision* — the same sequence of consonants and vowels carries different meanings depending on pitch contour. Speakers exploit this for compactness: a single short phrase can convey shades of meaning that English requires a paragraph to express. The richness comes from a small toolkit (the phonemes) deployed with discipline (the tones). Python has a similar property: a small toolkit of constructs (functions, classes, decorators, generators) deployed with discipline (indentation, naming, the Zen). The richness of Python — and of Django — comes from this compounding.

In the next letter we shall examine Django's specific philosophy — the choices that distinguish it from every other web framework.

---

### Letter 2: On Django's Philosophy — Batteries, DRY, and Pragmatism

Dear Reader,

Django's documentation begins, famously, with a list of philosophical principles. They are not abstract; they are observable in every page of code the framework provides. Three principles are load‑bearing.

**Batteries included.** When you install Django, you receive — without further setup — an HTTP server, a URL router, a templating engine, an Object‑Relational Mapper, a migrations system, an authentication system, a session system, an admin interface, a form library, a test framework, a caching framework, an internationalization system, and a security layer that prevents the eight most common web vulnerabilities. Other frameworks ship a minimal core and ask you to choose libraries for each concern. Django ships the choices, made well, integrated together.

The cost: you accept Django's choices. The benefit: you spend zero days choosing. For a small team in Nairobi shipping a logistics platform, the Django default is almost always good enough, and the team's energy can go to *the actual application* rather than the choice of which JWT library to use this week.

**Don't repeat yourself (DRY).** A piece of knowledge — what the User model looks like, what URL patterns the application accepts, how a date is formatted — should live in *exactly one place*. Django's design honors this. The model definition produces, automatically: the database schema, the form fields, the admin interface, the API serializers (with DRF), the validation rules. One declaration; many consequences.

```python
class Bale(models.Model):
    sku   = models.CharField(max_length=20, unique=True)
    name  = models.CharField(max_length=200)
    yards = models.PositiveIntegerField()
    color = models.CharField(max_length=50, blank=True)
    created = models.DateTimeField(auto_now_add=True)
```

This single class produces:
- A SQL table `app_bale` with columns matching the fields.
- A Python class with attributes for each column.
- Validation rules (PositiveInteger rejects negatives; max_length enforced).
- A default admin interface with editable forms.
- A form class auto‑generated for HTML forms.
- A migration that, when applied, creates the table in the database.

One class; six consequences. DRY at its purest.

**The pragmatic over the pure.** Django is not a research framework. It does not pursue elegance for its own sake. When a feature is useful in practice — even if theoretically inelegant — Django includes it. The admin is the most visible example: it is a working back‑office that fifteen seconds of configuration produces, and theoretically it violates separation of concerns by tying the model layer to a UI layer. Pragmatically, it has saved each of the thousands of organizations using Django thousands of hours of internal‑tool development. The trade is worth it.

There is a fourth principle, less often named but visible everywhere: **explicit is better than implicit**. URL patterns are written explicitly, not inferred from controller names. Database queries are written explicitly, not generated from method names. Settings live in a settings file, not in environment‑variable magic. This is Python's principle ("explicit is better than implicit" comes from the Zen of Python), inherited into Django.

The opposite philosophy, common in other frameworks, is **convention over configuration**. Rails embodies this: name a class `Bale` and Rails infers the database table, the controller, the views, the URL prefix. Django takes a different path: declare the URL pattern explicitly, declare the database table name (or accept the default but written in the code where you can see it). The Rails style produces shorter code; the Django style produces more readable code. Both have merit. Django's choice favors the reader six months later who needs to understand what the system actually does.

The parallel: in **Akan goldsmith tradition**, the master smith does not invent new symbols for each commission. He works from the canonical Adinkra vocabulary: Sankofa, Gye Nyame, Funtunfunefu. The customer who orders a stool knows which symbols they are getting; the apprentice who reads the master's notes knows; the descendant who inherits the stool knows. The vocabulary is shared and explicit; the freedom is in composition, not in invention. Django is built on this principle: a shared vocabulary of patterns; freedom in composition; the system remains legible because no one is reinventing the alphabet.

In the next letter we shall examine the **Model‑Template‑View** triad that organizes every Django application.

---

### Letter 3: On the Model‑Template‑View Triad

Dear Reader,

Every Django application is organized around three concepts: **Model**, **Template**, **View**. They are not all of Django — there are URLs, forms, middleware, signals, admin, and many more — but these three are the load‑bearing trio. Most other web frameworks call this **MVC** (Model‑View‑Controller); Django calls it **MTV** for historical reasons, but the correspondence is exact.

**Model** is the data layer. A model class declares the shape of an entity (User, Bale, Order). The framework maps each model to a database table. You query, create, update, and delete records through the model's Python API. The database is, from the developer's perspective, a collection of Python objects.

```python
# models.py
class Bale(models.Model):
    sku   = models.CharField(max_length=20, unique=True)
    yards = models.PositiveIntegerField()
```

**View** is the logic layer. A view is a Python function (or class) that takes an HTTP request and returns an HTTP response. The view fetches data from models, performs business logic, decides what to display, and produces a response — usually a rendered template, sometimes JSON, sometimes a redirect.

```python
# views.py
def bale_list(request):
    bales = Bale.objects.all()
    return render(request, 'shop/bale_list.html', {'bales': bales})
```

**Template** is the presentation layer. A template is an HTML file with placeholders for data and small constructs for loops and conditionals. The template engine renders it into final HTML by substituting the data passed in.

```html
<!-- bale_list.html -->
<h1>Inventory</h1>
<ul>
  {% for bale in bales %}
    <li>{{ bale.sku }} — {{ bale.yards }} yards</li>
  {% endfor %}
</ul>
```

A request enters Django, the URL dispatcher chooses a view, the view consults models, the view renders a template, the response leaves. Three layers, clean separation, predictable flow.

```
    THE MTV REQUEST FLOW

    Browser
      │
      │  GET /bales/
      ▼
    Django URL Dispatcher  (urls.py)
      │
      │  matches "bales/" → bale_list
      ▼
    View Function          (views.py)
      │
      ├─► Model            (models.py → database)
      │   Bale.objects.all()
      ◄─┘ returns list of Bale objects
      │
      ├─► Template         (templates/...)
      │   render(...)
      ◄─┘ returns rendered HTML
      │
      ▼
    HttpResponse
      │
      ▼
    Browser  ──── sees the inventory page
```

This separation is what makes Django applications easy to read. To understand what `/bales/` does, find the URL in `urls.py`, follow it to the view, see what models it queries, see what template it renders. Four files, in a known order. No magic.

A Django **project** is a collection of one or more **apps**, each app being a self‑contained module with its own models, views, templates, URLs. For Aminata's shop, you might have apps named `stock`, `orders`, `users`, `payments` — each a directory with its own models.py, views.py, etc. Apps can be reused across projects (the `django-allauth` package, for example, is a Django app you can drop into any project for sophisticated authentication).

This concludes Part I. You hold Python's character, Django's philosophy, and the MTV organization. In Part II we shall descend into the Model — Django's most distinctive contribution to web development.

---

## Part II: The Model — The Database as Python Objects

*On models, on migrations, on the QuerySet, and on relationships*

---

### Letter 4: On the Model and the Mapped Reality

Dear Reader,

Django's Object‑Relational Mapper — the ORM — was a quiet revolution. Before Django (and Rails, which had similar ambitions), the average web application talked to its database through raw SQL strings interpolated into the code. The code was verbose, error‑prone, and tied to a specific database. Worse, SQL injection vulnerabilities — bugs in which user input could rewrite the SQL — were endemic.

Django's ORM proposed: *describe your data as Python classes; we will generate the SQL and run it safely*. The class becomes the source of truth. The database table is a derived artifact.

```python
# models.py
from django.db import models

class Supplier(models.Model):
    name    = models.CharField(max_length=200)
    country = models.CharField(max_length=2)  # ISO country code

class Bale(models.Model):
    sku        = models.CharField(max_length=20, unique=True, db_index=True)
    name       = models.CharField(max_length=200)
    yards      = models.PositiveIntegerField()
    color      = models.CharField(max_length=50, blank=True)
    supplier   = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    in_stock   = models.BooleanField(default=True)
    price_cfa  = models.PositiveIntegerField()
    created    = models.DateTimeField(auto_now_add=True)
    updated    = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']
        indexes  = [models.Index(fields=['color', 'in_stock'])]

    def __str__(self):
        return f'{self.sku} — {self.name}'

    @property
    def price_with_margin(self):
        return int(self.price_cfa * 1.2)
```

Read this slowly. It is two model classes — Supplier and Bale — with about twelve fields, two indexes, an ordering rule, a string representation, and a computed property. Django reads this declaration and:

- Generates the corresponding SQL for PostgreSQL, MySQL, SQLite, or Oracle, depending on configuration.
- Produces a migration file that, when applied, creates the tables.
- Lets you query the data through Python:

```python
# Create
bale = Bale.objects.create(
    sku='DWP-016', name='Dutch wax', yards=16,
    supplier=vlisco, price_cfa=120000
)

# Read
in_stock = Bale.objects.filter(in_stock=True)
recent   = Bale.objects.filter(created__gte=date(2026, 1, 1))
indigo   = Bale.objects.filter(color__icontains='indigo')

# Update
Bale.objects.filter(sku='DWP-016').update(yards=14)

# Delete
Bale.objects.filter(in_stock=False, updated__lt=ninety_days_ago).delete()
```

The Python code is what the developer writes; the SQL is what the database receives. The translation is mechanical and *safe* — every value is parameterized, so SQL injection is structurally impossible.

The fields available — `CharField`, `IntegerField`, `BooleanField`, `DateField`, `DateTimeField`, `DecimalField`, `EmailField`, `URLField`, `FileField`, `ImageField`, `JSONField`, `UUIDField`, and many more — encode validation rules. `EmailField` validates email format. `URLField` validates URL syntax. `PositiveIntegerField` rejects negatives. The model's declared shape is also its validation contract.

The `class Meta` is where you configure non‑field behaviors: default ordering, database indexes, the human‑readable name (verbose_name), the table name override, and permissions. The `__str__` method is what shows up when you print the object — used everywhere from the admin to debug logs.

The `@property` decorator turns `price_with_margin` into a computed attribute. It looks like a field but is computed on every access. Useful for derived values that should not live in the database.

Three properties of Django models deserve memorization.

**The class IS the schema.** When you change a field — add a column, change a max_length, rename a field — you change the Python class, and a migration captures the change. The class is not a *description* of the database; it is the *authoritative source*, with the database catching up.

**Querying returns lazy iterables.** `Bale.objects.filter(...)` does not run a query immediately; it returns a `QuerySet` that represents *a query that has not yet been executed*. The query runs the moment you iterate over the QuerySet, count it, slice it, or otherwise force evaluation. This lazy discipline lets you compose complex queries without intermediate trips to the database.

**The ORM is escapable.** When the ORM cannot express what you need — usually for performance reasons in complex queries — you can drop to raw SQL with `connection.cursor()`. Django does not lock you in. Most code uses the ORM; the 1% that needs raw SQL has a clean escape hatch.

The parallel: the **village headman's register** in which every household, every plot, every dispute, every birth and death is recorded in a single book. The headman does not perform a survey when asked "how many people live in compound C?" He consults the register. The register is the *source of truth* for the village's state; reality is updated by deliberate entries; queries traverse the book. The model class is the digital register, and querying it is the consultation that produces answers without leaving the office.

In the next letter we shall examine **migrations** — the mechanism by which a change to the model becomes a change to the database.

---

### Letter 5: On Migrations and the Versioned Schema

Dear Reader,

A model is a declaration. A migration is a *change* — an addition, a removal, an alteration — recorded as a file, committed to git, and applied to the database in order. Migrations are the *version control* of your schema.

When you create or change a model, Django generates a migration with:

```bash
python manage.py makemigrations
```

The result is a Python file in the app's `migrations/` directory, named with a sequence number and a short description:

```python
# migrations/0003_bale_supplier.py
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('shop', '0002_initial_bale'),
    ]
    operations = [
        migrations.AddField(
            model_name='bale',
            name='supplier',
            field=models.ForeignKey(
                to='shop.Supplier',
                on_delete=models.PROTECT,
                null=True,
            ),
        ),
    ]
```

This file is the *change* to the schema. It depends on the previous migration; it declares the new operation. To apply it:

```bash
python manage.py migrate
```

Django consults the database's migration log (a table called `django_migrations`), determines which migrations have not yet been applied, and runs them in order. The schema advances. The log records what was done. On the next environment — staging, production, a colleague's laptop — the same migrations apply in the same order, producing the same schema.

This is the equivalent of git for your database. Want to roll back? `migrate shop 0002` reverses migration 0003 and any later ones. Want to see the state of the database at any historical point? Check out the corresponding code and look at the migrations applied up to that point.

The discipline of migrations:

**Make migrations small.** Each migration should be one logical change. Big migrations that combine "rename a field, add a column, drop a different column" are hard to review and hard to roll back. Split them.

**Review migrations like code.** A pull request that changes a model should include the auto‑generated migration. Reviewers should look at the SQL the migration will produce (`python manage.py sqlmigrate shop 0003`). A migration that drops a column has a cost that the model diff does not show; the SQL does.

**Backfill data with care.** Adding a NOT NULL column to a populated table requires care: existing rows have no value for the new field. The pattern is *three migrations*: add the field as nullable, run a data migration to backfill, alter the field to NOT NULL. Each step is reversible; production stays consistent.

**Test migrations.** A migration that works in development can fail in production if the data is different. The discipline is to run migrations on a staging database that mirrors production before deploying. For high‑stakes migrations (renaming a heavily‑used column), consider running the migration outside the deploy — at a quiet hour, with a known rollback path.

Migrations are one of Django's most under‑appreciated batteries. Frameworks without them rely on manual SQL scripts run by hand on each environment — a recipe for divergence. Django's migrations make the schema a versioned, reviewed, replayable artifact. The same machinery that gives you `git diff` for code gives you `python manage.py showmigrations` for the database.

The parallel: a **medieval scribe's ledger of land transfers**. Every transfer is a dated entry; the entries are immutable; reading from the beginning reconstructs the current state of ownership. The ledger is the system of record. Migrations are the ledger; the database is the current state; the entries are the operations that took the state from one configuration to the next.

In the next letter we shall examine **queries, managers, and the QuerySet** — Django's expressive query API.

---

### Letter 6: On Queries, Managers, and the QuerySet's Lazy Discipline

Dear Reader,

The **QuerySet** is the central object of Django's ORM. It represents *a query that has not yet been executed*. You build it up with filter, exclude, order_by, annotate calls, and execute it by iterating, counting, slicing, or asking for `.first()` or `.last()`. The laziness is what makes the API composable.

```python
qs = Bale.objects.all()                           # all bales
qs = qs.filter(in_stock=True)                     # filter to in-stock
qs = qs.filter(supplier__country='NL')            # supplier.country = NL
qs = qs.exclude(color='')                         # color is not empty
qs = qs.order_by('-created')                      # newest first
qs = qs[:20]                                      # first 20

for bale in qs:                                   # ← NOW the SQL runs
    print(bale.sku)
```

Until the `for` loop, no SQL has been issued. Each call returns a new QuerySet describing the *cumulative* query. When you finally iterate, Django generates one SQL statement that captures all the filters, joins, ordering, and limiting at once. The database does the work; Python receives the rows.

The field lookup syntax is the language Django invented to compose queries. The double underscore is the separator:

```python
filter(yards__gte=10)          # yards >= 10
filter(yards__lte=20)          # yards <= 20
filter(name__icontains='wax')  # name LIKE '%wax%' case-insensitive
filter(created__year=2026)     # year part of date is 2026
filter(created__gte=...)       # created >= date
filter(supplier__country='NL') # join through supplier, country = NL
filter(sku__in=['A', 'B', 'C'])# sku IN ('A','B','C')
filter(color__isnull=False)    # color IS NOT NULL
```

These are the most common; the full list is in Django's documentation and runs to dozens. The double‑underscore convention lets the API stay flat (no nested objects to construct) while supporting arbitrarily complex queries.

For more sophisticated work, **annotations** add computed columns:

```python
from django.db.models import Count, Sum, Avg, F

# How many bales per supplier?
qs = Supplier.objects.annotate(
    bale_count=Count('bale'),
    total_yards=Sum('bale__yards')
).filter(bale_count__gt=0)

# Apply a margin to the price (no Python loop)
Bale.objects.update(price_cfa=F('price_cfa') * 1.1)
```

The `F` expression refers to a database column. `F('price_cfa') * 1.1` is computed in the database, not in Python — efficient for bulk updates of millions of rows.

The `aggregate` method reduces a QuerySet to a single result:

```python
from django.db.models import Sum

total = Bale.objects.filter(in_stock=True).aggregate(total=Sum('yards'))
# total is {'total': 1842}
```

The **manager** is the object that lives at `.objects`. By default, it provides `all()`, `filter()`, `get()`, `create()`, `update()`, `delete()`. You can write *custom managers* that bake in common filters:

```python
class InStockManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(in_stock=True)

class Bale(models.Model):
    ...
    objects = models.Manager()       # the default
    in_stock_set = InStockManager()  # custom

# Usage
Bale.objects.all()         # all bales
Bale.in_stock_set.all()    # only in-stock bales
```

This is how Django teams encode business rules at the data layer. A `Bale.unsold` manager that automatically excludes sold bales; a `User.active` manager that automatically excludes soft‑deleted users. The application code reads `.active.filter(...)` and never accidentally returns deactivated users.

The most important performance discipline is the **N+1 query** problem. If you iterate a QuerySet and access a related field on each row, Django issues a query per row:

```python
# BAD — N+1 queries (one for bales, one per bale for supplier)
for bale in Bale.objects.all():
    print(bale.sku, bale.supplier.name)
```

`select_related` and `prefetch_related` solve it:

```python
# GOOD — one query joins supplier
for bale in Bale.objects.select_related('supplier'):
    print(bale.sku, bale.supplier.name)

# For many-to-many or reverse foreign keys
for supplier in Supplier.objects.prefetch_related('bale_set'):
    for bale in supplier.bale_set.all():
        print(bale.sku)
```

The Django shell — `python manage.py shell` — and the `django-debug-toolbar` package let you see exactly what SQL is being issued. Every Django engineer learns to read SQL output and tune queries with these tools.

In the next letter we shall examine **relationships** — how models refer to other models, and the foreign keys, one‑to‑manys, and many‑to‑manys that Django expresses cleanly.

---

### Letter 7: On Relationships and the Foreign Key

Dear Reader,

Real data is connected. A bale of fabric has a supplier; an order has a customer and many line items; a user has many addresses. The connections — *relationships* — are how relational databases differ from document databases, and Django expresses them as cleanly as any framework.

There are three kinds:

**One‑to‑many** (most common). A Bale has one Supplier; a Supplier has many Bales.

```python
class Supplier(models.Model):
    name = models.CharField(max_length=200)

class Bale(models.Model):
    sku      = models.CharField(max_length=20)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='bales')
```

`ForeignKey` on the "many" side. The `on_delete` argument says what to do when the supplier is deleted: PROTECT prevents deletion if bales exist; CASCADE deletes bales too; SET_NULL nulls the foreign key on bales (requires `null=True`); SET_DEFAULT sets to a default. PROTECT is usually the right answer for important relationships.

From the bale, you reach the supplier directly: `bale.supplier`. From the supplier, you reach the bales through the `related_name`: `supplier.bales.all()`. If you do not set `related_name`, Django uses the default `bale_set`.

**Many‑to‑many**. A bale has many tags; a tag belongs to many bales.

```python
class Tag(models.Model):
    name = models.CharField(max_length=50)

class Bale(models.Model):
    ...
    tags = models.ManyToManyField(Tag, blank=True, related_name='bales')
```

Django creates an intermediate table behind the scenes. Operations:

```python
bale.tags.add(tag1, tag2)
bale.tags.remove(tag3)
bale.tags.set([tag1, tag2])    # replace entirely
bale.tags.clear()

tag.bales.all()                 # reverse: all bales with this tag
```

If you need to store data on the relationship itself — "this bale acquired this tag on this date" — use a *through model*:

```python
class Tagging(models.Model):
    bale  = models.ForeignKey(Bale, on_delete=models.CASCADE)
    tag   = models.ForeignKey(Tag, on_delete=models.CASCADE)
    added = models.DateTimeField(auto_now_add=True)

class Bale(models.Model):
    tags = models.ManyToManyField(Tag, through=Tagging)
```

**One‑to‑one**. A user has exactly one profile. Use `OneToOneField`:

```python
class UserProfile(models.Model):
    user  = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20)
```

These three primitives — ForeignKey, ManyToMany, OneToOne — express every relational structure you need. Combined with the QuerySet's join syntax (`supplier__country='NL'`), they let you query complex graphs:

```python
# Bales whose supplier is in the Netherlands and which have the 'premium' tag
Bale.objects.filter(supplier__country='NL', tags__name='premium')

# Suppliers with at least one bale tagged 'premium'
Supplier.objects.filter(bales__tags__name='premium').distinct()
```

The double underscore traverses the relationship; the SQL JOIN is generated automatically.

The discipline around relationships:

**Use `on_delete` deliberately.** The default in modern Django is to require an explicit choice. Think about what *should* happen when the referenced row is deleted. For a supplier that has bales, PROTECT (deletion is forbidden) is usually right. For a bale's line item, CASCADE (delete the line item when the bale is deleted) is usually right.

**Index foreign keys that are used for filtering.** Django automatically indexes ForeignKey columns, which is usually correct. If you find yourself filtering on a non‑indexed column, add `db_index=True` to the field.

**Be wary of `null=True, blank=True` on ForeignKey.** It means the relationship is optional. Sometimes correct; often a sign of a missing concept. Ask: should this really be optional?

The parallel: the **family tree of a Soninke clan**. Each person has a clear lineage to their parents (foreign keys upward) and may have many children (reverse one‑to‑many). Marriages create alliances between families (many‑to‑many). The family historian — the griot — can answer "show me everyone descended from this ancestor" or "show me all alliances between these two families" by traversing the tree. Django's relationship API is the digital griot: define the connections; the system traverses them on demand.

This concludes Part II. The model layer is complete. In Part III we shall examine the View — where requests are received and responses produced.

---

## Part III: The View — Where Logic Meets the Request

*On URLs, on function‑based views, on class‑based views*

---

### Letter 8: On URL Routing and the Predictable Address

Dear Reader,

A Django application's URLs are declared in code — explicitly, in a file named `urls.py`. There is no auto‑discovery, no convention‑based routing. The list of URL patterns is the application's published interface.

```python
# shop/urls.py
from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    path('',                  views.home,         name='home'),
    path('bales/',            views.bale_list,    name='bale_list'),
    path('bales/<int:pk>/',   views.bale_detail,  name='bale_detail'),
    path('bales/new/',        views.bale_create,  name='bale_create'),
    path('bales/<int:pk>/edit/', views.bale_edit, name='bale_edit'),
    path('orders/',           views.order_list,   name='order_list'),
]
```

And the project's root urls.py:

```python
# project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('shop/',  include('shop.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
]
```

Read these carefully. Each `path` call is `(pattern, view, name=...)`. The pattern includes type converters: `<int:pk>` captures an integer into the variable `pk`; `<slug:name>` captures a slug; `<uuid:id>` captures a UUID. The named URL — `shop:bale_detail` — lets you refer to a URL by name from anywhere in the code, so URLs can be reorganized without breaking links.

```python
# In a template
<a href="{% url 'shop:bale_detail' pk=bale.pk %}">{{ bale.sku }}</a>

# In Python
return redirect('shop:bale_list')

# In a model
def get_absolute_url(self):
    return reverse('shop:bale_detail', kwargs={'pk': self.pk})
```

The view receives the captured parameters as named arguments:

```python
def bale_detail(request, pk):
    bale = get_object_or_404(Bale, pk=pk)
    return render(request, 'shop/bale_detail.html', {'bale': bale})
```

For URL patterns that need regex (Django's `path` does only simple converters), `re_path` accepts full regex:

```python
re_path(r'^bales/(?P<sku>[A-Z]{3}-\d{3})/$', views.bale_by_sku),
```

The discipline of URLs:

**Plural for collections, singular not used.** `/bales/`, not `/bale/`. This matches REST conventions and reads correctly in English.

**Use slugs for human‑facing URLs.** `/bales/dutch-wax-indigo-ochre/` is better than `/bales/507f1f77.../` for SEO and shareability. Store the slug as a unique field; look up by slug.

**Use IDs for internal or admin URLs.** `/admin/bales/123/` is fine because nobody bookmarks it.

**Version your API URLs if they will outlive a major rewrite.** `/api/v1/bales/`. We shall meet REST APIs in DRF.

The parallel: the **village naming system** in much of West Africa, where every compound has a precise address derivable from the family tree, the quarter, and the village. A messenger from Dakar who needs to find a particular cousin in a village in Casamance can do so with a path: village → quarter → family → compound → person. The path is hierarchical, predictable, and stable. Django's URL patterns are this addressing system: hierarchical, explicit, and stable across the codebase's lifetime.

---

### Letter 9: On Function‑Based Views

Dear Reader,

The simplest Django view is a function. It takes a request, does work, returns a response.

```python
# views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Bale
from .forms import BaleForm

def bale_list(request):
    bales = Bale.objects.filter(in_stock=True).select_related('supplier')
    return render(request, 'shop/bale_list.html', {'bales': bales})

def bale_detail(request, pk):
    bale = get_object_or_404(Bale, pk=pk)
    return render(request, 'shop/bale_detail.html', {'bale': bale})

@login_required
def bale_create(request):
    if request.method == 'POST':
        form = BaleForm(request.POST)
        if form.is_valid():
            bale = form.save(commit=False)
            bale.created_by = request.user
            bale.save()
            return redirect('shop:bale_detail', pk=bale.pk)
    else:
        form = BaleForm()
    return render(request, 'shop/bale_form.html', {'form': form})

def bale_api(request):
    bales = list(Bale.objects.values('id', 'sku', 'yards'))
    return JsonResponse({'bales': bales})
```

Four views, four shapes:

1. **List**: query, render template.
2. **Detail**: lookup by PK (or 404), render template.
3. **Form**: GET shows empty form; POST validates and saves.
4. **API**: query, return JSON.

The decorators add behaviors. `@login_required` redirects unauthenticated users to the login page. There are many: `@permission_required`, `@require_http_methods(['GET', 'POST'])`, `@cache_page(60)`, `@csrf_exempt`. Decorators are how Django adds cross‑cutting concerns without modifying the view's body.

The pattern of "GET shows form; POST validates and saves" is so common that Django provides shortcuts. The above view, written manually, takes 8 lines. With class‑based generic views (next letter), it can be a 3‑line class. With formtools or django‑crispy‑forms, less still. But the explicit pattern remains the most flexible, and most Django teams use it for non‑trivial views.

The response is one of several:
- `render(request, 'template.html', context)` — renders a template.
- `redirect('url_name', ...)` — sends a 302 redirect.
- `JsonResponse({...})` — returns JSON.
- `HttpResponse('text')` — returns raw text.
- `FileResponse(open('file.pdf', 'rb'))` — streams a file.

The view's job is to take a request and produce one of these. The view is *not* responsible for templating, database access, or HTML generation; it coordinates those concerns by calling the right pieces.

The function‑based view, since Django 1.0, has been the workhorse. It is simple, readable, and flexible. Class‑based views (next letter) trade flexibility for less boilerplate; in practice, most Django teams use both, choosing per view.

---

### Letter 10: On Class‑Based Views and Reusable Behaviour

Dear Reader,

A class‑based view (CBV) packages a view's logic into a class. Django provides a hierarchy of *generic CBVs* — `ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView` — that handle the most common patterns with little code.

```python
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Bale
from .forms import BaleForm

class BaleListView(ListView):
    model = Bale
    template_name = 'shop/bale_list.html'  # default would be 'shop/bale_list.html'
    context_object_name = 'bales'           # default would be 'object_list'
    paginate_by = 20

    def get_queryset(self):
        return Bale.objects.filter(in_stock=True).select_related('supplier')

class BaleDetailView(DetailView):
    model = Bale
    template_name = 'shop/bale_detail.html'

class BaleCreateView(LoginRequiredMixin, CreateView):
    model = Bale
    form_class = BaleForm
    template_name = 'shop/bale_form.html'
    success_url = reverse_lazy('shop:bale_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)
```

Three views; each a few lines. The base classes do the work — the list view paginates and renders the template; the detail view fetches by PK; the create view shows the form on GET, validates and saves on POST, redirects on success. The developer overrides only the bits that diverge from default.

The URL configuration changes slightly — the view is now `BaleListView.as_view()`:

```python
path('bales/', BaleListView.as_view(), name='bale_list'),
path('bales/<int:pk>/', BaleDetailView.as_view(), name='bale_detail'),
path('bales/new/', BaleCreateView.as_view(), name='bale_create'),
```

The `as_view()` factory turns the class into a view function that Django can dispatch to.

Mixins are how CBVs compose. `LoginRequiredMixin` adds the auth requirement. `UserPassesTestMixin` adds custom authorization. `FormView`, `TemplateView`, `RedirectView` provide base behaviors that can be combined.

The trade between FBVs and CBVs is real:
- **FBVs** are more explicit and easier to read for newcomers. The entire view is in one function.
- **CBVs** are more concise for boilerplate views and easier to extend through inheritance.

My recommendation: use CBVs for generic CRUD where the defaults match (90% of admin‑style views). Use FBVs for unique business logic where clarity matters more than brevity. Mixed codebases — both styles, chosen per view — are common and healthy.

---

## Part IV: The Template and the Form

*On templates, on forms, on the discipline of validated input*

---

### Letter 11: On Templates and the Separation of Display

Dear Reader,

A template is an HTML file with placeholders. The template engine substitutes the placeholders with data and produces the final HTML the browser sees.

```html
{% extends 'shop/base.html' %}

{% block title %}Inventory{% endblock %}

{% block content %}
<h1>Inventory</h1>

{% if bales %}
  <table>
    <tr>
      <th>SKU</th>
      <th>Name</th>
      <th>Yards</th>
      <th>Supplier</th>
    </tr>
    {% for bale in bales %}
      <tr class="{% cycle 'odd' 'even' %}">
        <td>{{ bale.sku }}</td>
        <td><a href="{% url 'shop:bale_detail' pk=bale.pk %}">{{ bale.name }}</a></td>
        <td>{{ bale.yards }}</td>
        <td>{{ bale.supplier.name }}</td>
      </tr>
    {% endfor %}
  </table>

  {% if is_paginated %}
    <nav class="pagination">
      {% if page_obj.has_previous %}
        <a href="?page={{ page_obj.previous_page_number }}">Previous</a>
      {% endif %}
      Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}
      {% if page_obj.has_next %}
        <a href="?page={{ page_obj.next_page_number }}">Next</a>
      {% endif %}
    </nav>
  {% endif %}
{% else %}
  <p>No bales in stock.</p>
{% endif %}
{% endblock %}
```

Read this carefully. The syntax has three constructs:

- **`{{ variable }}`** — interpolation. Outputs the value. Auto‑escaped, so user input cannot inject HTML.
- **`{% tag %}`** — block tags. `for`, `if`, `block`, `extends`, `include`, `url`, `cycle`, `now`, `csrf_token`, and many more.
- **`{# comment #}`** — comments. Not rendered.

The `extends 'shop/base.html'` line says: *this template inherits from base.html*. The `{% block content %}` blocks fill in the parent's named slots. This is **template inheritance**, and it is how shared layout works in Django.

```html
<!-- shop/base.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}Shop{% endblock %}</title>
  <link rel="stylesheet" href="{% static 'shop/style.css' %}">
</head>
<body>
  <header>
    <a href="{% url 'shop:home' %}">Aminata's Shop</a>
    {% if user.is_authenticated %}
      Welcome, {{ user.first_name }}
    {% else %}
      <a href="{% url 'login' %}">Login</a>
    {% endif %}
  </header>
  <main>
    {% block content %}{% endblock %}
  </main>
</body>
</html>
```

The base defines the layout. Each page extends the base and fills in `title` and `content`. The header is rendered once across every page — a single change updates the header on every page in the application.

Template tags are designed to be **logic‑limited**. You can iterate, conditionally render, and call simple filters. You cannot define functions, call arbitrary methods with arguments, or perform complex computation. The discipline forces business logic into the view (Python) and keeps the template focused on presentation. This is why Django templates feel more constrained than, say, JSX (which is full JavaScript): the constraint is deliberate.

**Filters** are functions applied with the pipe character:

```html
{{ name|upper }}                        ← uppercase
{{ price|floatformat:2 }}              ← format with 2 decimals
{{ created|date:"d M Y" }}             ← format date
{{ description|truncatewords:30 }}     ← truncate to 30 words
{{ html|safe }}                        ← do NOT escape (use carefully!)
{{ list|join:", " }}                   ← join with separator
{{ name|default:"Unknown" }}           ← fallback for empty
```

There are dozens. You can write custom filters and tags when needed; most projects rarely need to.

The auto‑escaping is the security default. `{{ user_input }}` outputs the value with HTML special characters (`<`, `>`, `&`, `"`, `'`) replaced by their HTML entities. This is what prevents Cross‑Site Scripting (XSS): a malicious user cannot inject a `<script>` tag through a comment because Django escapes the `<` to `&lt;`. The `|safe` filter explicitly opts out — used only for HTML you trust, never for user input.

The parallel: the **Adinkra cloth stamping** discipline. The cloth (the layout) is prepared first. Each stamp (the data) is applied in a designated location. The stamper does not invent new symbols; she uses the established vocabulary. The structure is fixed; the content varies. Django templates are this stamping: the HTML is the cloth; the variables are the stamps; the discipline is in keeping the two roles distinct.

In the next letter we shall examine **forms** — Django's form library that turns HTML inputs into validated Python objects.

---

### Letter 12: On Forms and the Discipline of Validated Input

Dear Reader,

A form in Django is a Python class that declares fields, validates submitted data, and renders the HTML. It is the bridge between an HTML `<form>` and a model.

```python
# forms.py
from django import forms
from .models import Bale

class BaleForm(forms.ModelForm):
    class Meta:
        model = Bale
        fields = ['sku', 'name', 'yards', 'color', 'supplier']
        widgets = {
            'color': forms.TextInput(attrs={'placeholder': 'indigo-ochre'}),
        }

    def clean_sku(self):
        sku = self.cleaned_data['sku']
        if not sku.startswith('DWP-'):
            raise forms.ValidationError('SKU must start with DWP-')
        return sku
```

`ModelForm` derives the form from a model. The `Meta` declares which fields to include. The `clean_sku` method adds custom validation; raising `ValidationError` rejects the submission.

In the view, the form coordinates GET (show empty) and POST (validate and save):

```python
def bale_create(request):
    if request.method == 'POST':
        form = BaleForm(request.POST)
        if form.is_valid():
            bale = form.save()
            return redirect('shop:bale_detail', pk=bale.pk)
    else:
        form = BaleForm()
    return render(request, 'shop/bale_form.html', {'form': form})
```

In the template, the form renders itself:

```html
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Save</button>
</form>
```

`{{ form.as_p }}` renders each field wrapped in `<p>` tags. There are alternatives: `as_table`, `as_ul`, or rendering individual fields:

```html
<form method="post">
  {% csrf_token %}
  <div class="field">
    {{ form.sku.label_tag }}
    {{ form.sku }}
    {{ form.sku.errors }}
  </div>
  <div class="field">
    {{ form.yards.label_tag }}
    {{ form.yards }}
    {{ form.yards.errors }}
  </div>
  <button type="submit">Save</button>
</form>
```

The `{% csrf_token %}` is critical. It inserts a hidden field that proves the form was loaded from your site (not from a malicious third party). Django's CSRF middleware verifies this on every POST. Forgetting `{% csrf_token %}` is a common beginner mistake; Django will reject the submission with a 403.

Validation is layered:

1. **Field validation** — each field's `clean()` method validates the type and basic constraints (e.g., `IntegerField` rejects non‑numbers).
2. **Field‑level custom** — `clean_<fieldname>` methods you write.
3. **Form‑level** — the `clean()` method on the form validates across fields ("end_date must be after start_date").
4. **Model validation** — runs when `form.save()` is called, applying any model‑level constraints.

When validation fails, `form.is_valid()` returns False, and the template renders the form with error messages next to the appropriate fields. The user sees what went wrong without losing what they entered.

For more complex forms — adding files, handling formsets (multiple instances of the same form), wizards across multiple pages — Django provides additional classes. The form layer scales from simple inputs to complex applications without changing the basic shape.

The parallel: the **traditional dispute mediation** under the palaver tree. The disputant brings their case; the elders verify it field by field — names of witnesses, dates, evidence; if any field fails, the case is sent back for correction; only when every claim survives examination does the matter proceed to judgment. Django's form is this examination: fields, cross‑checks, returned for correction, accepted only when whole.

---

## Part V: The Crown — Admin, Auth, Middleware

*On the Django admin, on the authentication system, on the request's journey through middleware*

---

### Letter 13: On the Django Admin — the Crown Jewel

Dear Reader,

Of all Django's batteries, the **admin** is the one most likely to make you stop, lean back, and laugh — at how much you get from how little. From three lines of code, Django produces a full back‑office: list views, detail views, search, filtering, pagination, foreign‑key dropdowns, file uploads, bulk actions, and an audit log of who changed what.

```python
# shop/admin.py
from django.contrib import admin
from .models import Bale, Supplier

admin.site.register(Supplier)
admin.site.register(Bale)
```

Two lines. Visit `/admin/` (after creating a superuser with `python manage.py createsuperuser`), log in, and you can:
- See every Supplier and Bale.
- Edit any field of any record.
- Create new records.
- Delete records (with confirmation).
- Search by any field.
- Filter by foreign key.
- See change history per record.

For more customization, declare an `ModelAdmin` class:

```python
@admin.register(Bale)
class BaleAdmin(admin.ModelAdmin):
    list_display    = ['sku', 'name', 'yards', 'supplier', 'in_stock', 'created']
    list_filter     = ['in_stock', 'supplier', 'color']
    search_fields   = ['sku', 'name']
    ordering        = ['-created']
    date_hierarchy  = 'created'
    actions         = ['mark_out_of_stock']
    readonly_fields = ['created', 'updated']

    def mark_out_of_stock(self, request, queryset):
        queryset.update(in_stock=False)
    mark_out_of_stock.short_description = 'Mark selected as out of stock'
```

This class — twelve lines — gives the admin: a list showing six columns, sidebar filters for in_stock and supplier, a search box, date navigation, a custom bulk action ("mark out of stock"), and read‑only fields for created/updated. For an internal tool, this is enough. Aminata's clerks can manage inventory from a browser without anyone writing a custom UI.

The admin is the famous *productivity multiplier* of Django. A startup that would otherwise spend a week building an internal CMS spends fifteen minutes registering models. The admin is not pretty by modern standards — it has the design sensibility of 2008 — but it is *workable*, and "workable in fifteen minutes" beats "beautiful in fifteen days" for almost every internal tool.

Three properties of the admin worth understanding:

**The admin is for staff, not customers.** It is feature‑rich for editing, weak in workflow. Use it for back‑office; do not show it to customers. Customer‑facing UI is built with regular views and templates.

**The admin respects model‑level permissions.** Each user gets per‑model add/change/delete permissions. You can give your inventory clerk permission to add bales but not to delete suppliers. The permission system is described in Letter 14.

**The admin can be heavily customized.** Inline editing of related models, custom widgets, custom filters, custom change views — the `ModelAdmin` class has dozens of hooks. Many Django teams build sophisticated custom admins for power users. There is also `django-admin-interface` and other packages that modernize the look.

The parallel: the **village chief's office** — the central administrative point of a traditional African village. The chief does not build it from scratch when he assumes office; he inherits it. The office has a record book, a stamping desk, a meeting area, a roster of names. He can add new ceremonies or modify existing ones, but the basic apparatus comes ready‑built and recognizable to every successor. Django's admin is this office: built once for the framework; inherited by every project; modified per local need; functioning from day one.

---

### Letter 14: On Authentication, Users, and the Permission System

Dear Reader,

Django ships with a full authentication system. Users, groups, permissions, sessions, login views, logout views, password reset, password change — all included.

The `User` model is provided. By default it has `username`, `email`, `first_name`, `last_name`, `password` (hashed with PBKDF2 by default, configurable to Argon2 or bcrypt), `is_active`, `is_staff`, `is_superuser`, and timestamps.

```python
from django.contrib.auth.models import User

# Create
user = User.objects.create_user('aminata', 'aminata@shop.ci', 'password')

# Authenticate
from django.contrib.auth import authenticate
user = authenticate(username='aminata', password='password')
if user is not None:
    # user is valid
    pass
```

For login, Django provides built‑in views. Add to your URL config:

```python
urlpatterns = [
    ...
    path('accounts/', include('django.contrib.auth.urls')),
]
```

This adds `/accounts/login/`, `/accounts/logout/`, `/accounts/password_change/`, `/accounts/password_reset/`, and the corresponding forms. You provide templates (with names like `registration/login.html`) and Django wires them up. Password reset includes the email sending; you provide the email template.

To protect a view, use the decorator:

```python
from django.contrib.auth.decorators import login_required

@login_required
def bale_create(request):
    ...
```

Or for class‑based views, the mixin:

```python
from django.contrib.auth.mixins import LoginRequiredMixin

class BaleCreateView(LoginRequiredMixin, CreateView):
    ...
```

Unauthenticated users are redirected to the login page.

**Permissions** are fine‑grained. Each model automatically gets four permissions: `add`, `change`, `delete`, `view`. You can declare more:

```python
class Bale(models.Model):
    ...
    class Meta:
        permissions = [
            ('mark_sold', 'Can mark bales as sold'),
            ('export', 'Can export bale data'),
        ]
```

Check permissions in views:

```python
@permission_required('shop.mark_sold')
def mark_sold(request, pk):
    ...

# Or in code
if request.user.has_perm('shop.mark_sold'):
    ...
```

**Groups** bundle permissions. The Inventory Clerks group has add_bale, change_bale, view_bale but not delete_bale. Assign users to groups; permissions follow.

**Custom User model.** For applications with non‑standard authentication (phone number as username, no email required, etc.), define a custom user model from day one:

```python
class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, unique=True)
    # ...
```

And in settings:

```python
AUTH_USER_MODEL = 'shop.CustomUser'
```

This is a one‑time decision. Switching to a custom user model after the project has data is painful; Django docs warn strongly to do it on day one.

**Sessions.** Django manages sessions automatically, storing them in the database by default (configurable to cache, file, signed cookie). The session ID is in a cookie; the data is on the server. `request.session['key'] = 'value'` persists across requests.

For API authentication (instead of session), Django REST Framework provides token authentication, JWT (via `djangorestframework-simplejwt`), and OAuth (via `django-oauth-toolkit`). We shall examine DRF in Part VI.

---

### Letter 15: On Middleware and the Request's Journey

Dear Reader,

Every Django request passes through a chain of **middleware** — a series of functions that can inspect, modify, or short‑circuit the request before it reaches the view, and again on the way back with the response.

```python
# settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

These are the defaults. Each one is a class with `__call__` (or function) that wraps the next layer. They are applied in *order on the way in* and *reverse order on the way out*:

```
    Request →  SecurityMiddleware
            →  SessionMiddleware
            →  CommonMiddleware
            →  CsrfViewMiddleware
            →  AuthenticationMiddleware    ← attaches request.user
            →  MessageMiddleware
            →  XFrameOptionsMiddleware
            →  View                         ← your code runs here
            ←  XFrameOptionsMiddleware
            ←  MessageMiddleware
            ←  AuthenticationMiddleware
            ←  CsrfViewMiddleware
            ←  CommonMiddleware
            ←  SessionMiddleware
            ←  SecurityMiddleware
    Response
```

Each middleware does one thing:

- **SecurityMiddleware** adds security headers (X‑Content‑Type‑Options, Strict‑Transport‑Security if configured).
- **SessionMiddleware** loads the session from the cookie, makes it available as `request.session`.
- **CommonMiddleware** handles trailing‑slash redirects, sets ETags.
- **CsrfViewMiddleware** verifies the CSRF token on POST/PUT/DELETE.
- **AuthenticationMiddleware** loads the user from the session, attaches as `request.user`.
- **MessageMiddleware** enables the message framework for flash messages.
- **XFrameOptionsMiddleware** sets `X-Frame-Options: DENY` to prevent clickjacking.

You can write custom middleware for cross‑cutting concerns — request logging, rate limiting, multi‑tenancy, A/B testing:

```python
class RequestTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        import time
        start = time.time()
        response = self.get_response(request)
        duration = time.time() - start
        response['X-Request-Duration'] = f'{duration:.3f}'
        return response
```

Add it to `MIDDLEWARE`. Every request now carries a timing header in the response.

The middleware system is Django's mechanism for *uniform per‑request behavior*. Without it, every view would need to remember to log, to authenticate, to set headers. With it, the behavior is declared once and applied universally.

---

## Part VI: The Modern Django

*On the REST framework, on async views, on caching and Celery*

---

### Letter 16: On Django REST Framework and the Serialized API

Dear Reader,

Modern web applications often have two faces: HTML pages for browsers, JSON APIs for mobile apps, single‑page applications, and third‑party integrations. Django can serve both, but the JSON side benefits enormously from a separate library: **Django REST Framework** (DRF).

DRF turns Django models into REST APIs with minimal code.

```python
# serializers.py
from rest_framework import serializers
from .models import Bale, Supplier

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Supplier
        fields = ['id', 'name', 'country']

class BaleSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer(read_only=True)
    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(), source='supplier', write_only=True
    )

    class Meta:
        model  = Bale
        fields = ['id', 'sku', 'name', 'yards', 'color',
                  'supplier', 'supplier_id', 'in_stock', 'created']
        read_only_fields = ['created']
```

```python
# views.py
from rest_framework import viewsets, permissions
from .serializers import BaleSerializer
from .models import Bale

class BaleViewSet(viewsets.ModelViewSet):
    queryset           = Bale.objects.select_related('supplier')
    serializer_class   = BaleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields   = ['in_stock', 'supplier']
    search_fields      = ['sku', 'name']
    ordering_fields    = ['created', 'yards']
```

```python
# urls.py
from rest_framework import routers
from .views import BaleViewSet

router = routers.DefaultRouter()
router.register(r'bales', BaleViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
```

Twenty lines total. The result is a complete REST API:

- `GET /api/bales/` — list bales (paginated, filterable, searchable, orderable).
- `POST /api/bales/` — create a bale.
- `GET /api/bales/{id}/` — retrieve a bale.
- `PUT /api/bales/{id}/` — replace a bale.
- `PATCH /api/bales/{id}/` — partially update.
- `DELETE /api/bales/{id}/` — delete.

Plus a browsable web interface at `/api/bales/` where you can interactively explore the API in a browser. The DRF developer experience is among the best in any web framework.

Authentication for APIs is configured in settings:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

Token authentication issues each user a long‑lived token; JWT (via `djangorestframework-simplejwt`) issues short‑lived signed tokens with refresh. The choice depends on your client.

DRF is opinionated and powerful. It is the standard way Django talks JSON. If your application has any non‑browser client — mobile, SPA, integrations — install DRF on day one.

---

### Letter 17: On Async Views and Django Channels — Real‑Time Django

Dear Reader,

For most of its history, Django was synchronous. Each request was handled in a single thread, blocking until complete. This worked, but it made WebSockets, server‑sent events, and high‑concurrency I/O awkward.

Starting in Django 3.0 and maturing through 4.x and 5.x, Django gained **async views**:

```python
import asyncio
from django.http import JsonResponse

async def fetch_aggregated(request):
    a, b, c = await asyncio.gather(
        fetch_one('https://api.a.com'),
        fetch_one('https://api.b.com'),
        fetch_one('https://api.c.com'),
    )
    return JsonResponse({'a': a, 'b': b, 'c': c})
```

Three external API calls in parallel; the view awaits all three. The savings are real: 300ms latency instead of 900ms when each call takes 300ms. The ORM also supports async — `await Bale.objects.aget(pk=42)` — for views that need both async I/O and database access.

For WebSockets and long‑lived connections, **Django Channels** is the official extension. Channels turns Django into an asynchronous protocol server using ASGI (Asynchronous Server Gateway Interface):

```python
# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class OrderUpdatesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = f'orders_{self.scope["user"].id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def order_update(self, event):
        await self.send(text_data=json.dumps(event['data']))
```

A WebSocket consumer that receives order updates for the current user. When the order service in your application broadcasts to the user's group, the consumer pushes the update to the client. The frontend opens a WebSocket and receives live updates without polling.

For most Django applications, async is optional. If your application is mostly database‑backed CRUD with occasional external API calls, synchronous Django scales further than most teams need. Add async where the workload demands it (heavy I/O fan‑out, real‑time updates, chat). The framework supports both styles in the same project.

---

### Letter 18: On Caching, Signals, and Celery — Scaling Patterns

Dear Reader,

Three patterns appear in every large Django application beyond the core MTV.

**Caching.** Django has a built‑in cache framework supporting in‑memory, Memcached, Redis, and database backends. Configure in settings:

```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

Use programmatically:

```python
from django.core.cache import cache

cache.set('bales:in_stock_count', Bale.objects.filter(in_stock=True).count(), 60)
count = cache.get('bales:in_stock_count')
```

Or at the view level:

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)
def bale_list(request):
    ...
```

The view's response is cached for 15 minutes. Subsequent requests hit the cache instead of running the view. For high‑traffic pages, this is the difference between scaling on one server and scaling on ten.

Template fragment caching caches a portion of a template:

```html
{% load cache %}
{% cache 300 sidebar request.user.username %}
  ... expensive sidebar content ...
{% endcache %}
```

**Signals.** A signal is a notification fired by one part of the codebase, listened to by another. Django sends built‑in signals for events like `post_save`, `pre_delete`, `request_started`:

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order

@receiver(post_save, sender=Order)
def notify_admin(sender, instance, created, **kwargs):
    if created:
        send_email('new order: ' + instance.id, ...)
```

Whenever an Order is saved (created or updated), this handler runs. Signals are useful for cross‑app concerns (the orders app doesn't import the notifications app; signals connect them). They can also be a source of confusing action‑at‑a‑distance; use them sparingly.

**Celery.** For background tasks — sending emails, processing uploads, generating reports — running them in the request/response cycle slows users and ties up workers. **Celery** is the standard task queue for Django:

```python
# tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_order_email(order_id):
    order = Order.objects.get(pk=order_id)
    send_mail('Your order', f'Order {order.id} confirmed', 'shop@aminata.ci', [order.email])
```

In the view:

```python
send_order_email.delay(order.id)
```

`delay` queues the task. A separate Celery worker process picks it up and runs it. The user's response is sent immediately; the email is sent in the background.

Celery typically uses Redis or RabbitMQ as the message broker. The architecture is:

```
    Django web ──► Redis ──► Celery worker ──► (sends emails, hits APIs, etc.)
                  (queue)
```

For Aminata's shop, the pattern: order created → enqueue order_confirmation task → user redirected to "thanks" page in 100ms. Meanwhile, the worker sends the email, generates the receipt PDF, updates the inventory system, and notifies the warehouse — all without making the user wait.

---

## Part VII: The Deployment and the Boundary

*On Gunicorn and Nginx, on settings and secrets, on testing, and on when to use Django*

---

### Letter 19: On Gunicorn, Nginx, and the Production Architecture

Dear Reader,

A Django application in development runs with `python manage.py runserver` — a built‑in development server. *That server must never face production traffic.* It is single‑threaded, has weak security defaults, and reloads code on every change — none of which is what production needs.

The standard production deployment uses two pieces:

**Gunicorn** (or uWSGI) is a Python WSGI server. It runs multiple Django worker processes, each handling requests in parallel. Workers can be threaded, sync, or async (with `gevent`). Gunicorn is reliable, well‑documented, and the standard for Django.

```bash
gunicorn project.wsgi:application --workers 4 --bind 0.0.0.0:8000
```

Four workers; binds to port 8000. Each worker holds a Django application instance in memory and handles requests independently.

**Nginx** is the reverse proxy in front of Gunicorn. It:
- Terminates HTTPS (decrypts TLS so Gunicorn sees plain HTTP).
- Serves static files (CSS, JS, images) directly without involving Django.
- Buffers slow client connections (a client on 3G doesn't tie up a Gunicorn worker for ten seconds).
- Handles rate limiting and basic security headers.

```nginx
server {
    listen 443 ssl;
    server_name shop.aminata.ci;
    ssl_certificate /etc/letsencrypt/live/.../fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/.../privkey.pem;

    location /static/ {
        alias /var/www/shop/static/;
        expires 30d;
    }

    location /media/ {
        alias /var/www/shop/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The architecture:

```
    Customer's phone
          │ HTTPS
          ▼
       Nginx ─── serves /static/ directly ──► [disk]
          │
          │ HTTP localhost
          ▼
      Gunicorn (4 workers)
          │
          ▼
      Django application
          │
          ├──► PostgreSQL
          ├──► Redis (cache, sessions)
          └──► Celery worker  (background tasks)
```

This is the canonical Django production architecture, unchanged in its essentials for fifteen years. Add a load balancer in front (HAProxy, AWS ALB) for multi‑server deployments. Add a CDN (Cloudflare) for static assets. Add a managed database (RDS, DigitalOcean Managed PostgreSQL) instead of running your own. The skeleton remains the same.

Static files require attention. In production, run `python manage.py collectstatic` to copy all CSS, JS, and image files from each app's `static/` directory into a single `STATIC_ROOT` directory that Nginx serves. Django's `django.contrib.staticfiles` handles the collection; **WhiteNoise** is a popular library that lets Gunicorn serve static files directly without Nginx (useful for simpler deployments like Heroku).

---

### Letter 20: On Settings, Secrets, and Multiple Environments

Dear Reader,

A Django project's settings.py is the configuration file. It declares the database, secret key, installed apps, middleware, allowed hosts, debug mode, time zone, and dozens of other things. The discipline is: *production must not run with development settings, and secrets must not be in source code*.

The common pattern: split settings into multiple files.

```
    project/
    └── settings/
        ├── __init__.py
        ├── base.py        ← shared defaults
        ├── development.py ← DEBUG=True, local DB
        ├── staging.py     ← production-like, smaller
        └── production.py  ← DEBUG=False, real DB
```

`base.py` holds everything common. `development.py` imports from base and overrides:

```python
# development.py
from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME':   BASE_DIR / 'db.sqlite3',
    }
}
```

`production.py` reads secrets from environment variables:

```python
# production.py
from .base import *
import os

DEBUG = False
ALLOWED_HOSTS = ['shop.aminata.ci']

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.postgresql',
        'NAME':     os.environ['DB_NAME'],
        'USER':     os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST':     os.environ['DB_HOST'],
        'PORT':     5432,
    }
}

# Force HTTPS
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

In development, you run:
```bash
DJANGO_SETTINGS_MODULE=project.settings.development python manage.py runserver
```

In production:
```bash
DJANGO_SETTINGS_MODULE=project.settings.production gunicorn ...
```

The libraries **python-decouple** and **django-environ** provide nicer interfaces to environment variables:

```python
from environ import Env
env = Env()
env.read_env('.env')

DEBUG       = env.bool('DEBUG', default=False)
SECRET_KEY  = env('SECRET_KEY')
DATABASES   = {'default': env.db()}
```

The `.env` file holds development values; it is *not committed to git*. Production environment variables are set by the platform.

Five settings discipline rules:

1. **Never commit SECRET_KEY to git.** Regenerate if it leaks.
2. **DEBUG = False in production.** Always. Debug mode exposes stack traces and configuration to users.
3. **ALLOWED_HOSTS is set in production.** Empty list = nothing accepted; misconfigured = catastrophic.
4. **DATABASES uses env vars.** Connection strings, passwords, hosts — all from environment.
5. **`STATIC_ROOT` and `MEDIA_ROOT` are absolute paths in production.** Relative paths break under Gunicorn.

---

### Letter 21: On Testing in Django — Models, Views, APIs

Dear Reader,

Django ships with a test framework built on Python's `unittest`. Tests live in `tests.py` in each app or in a `tests/` package.

```python
# shop/tests.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Bale, Supplier

class BaleModelTests(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(name='Vlisco', country='NL')

    def test_str_representation(self):
        bale = Bale.objects.create(sku='DWP-001', name='Dutch wax',
                                   yards=16, supplier=self.supplier,
                                   price_cfa=100000)
        self.assertEqual(str(bale), 'DWP-001 — Dutch wax')

    def test_negative_yards_rejected(self):
        bale = Bale(sku='X', name='X', yards=-1,
                    supplier=self.supplier, price_cfa=1)
        with self.assertRaises(Exception):
            bale.full_clean()

class BaleViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('aminata', password='secret')
        self.supplier = Supplier.objects.create(name='Vlisco', country='NL')

    def test_bale_list_requires_login(self):
        response = self.client.get(reverse('shop:bale_list'))
        self.assertEqual(response.status_code, 302)  # redirect to login

    def test_bale_list_authenticated(self):
        self.client.login(username='aminata', password='secret')
        Bale.objects.create(sku='A', name='A', yards=10,
                            supplier=self.supplier, price_cfa=1)
        response = self.client.get(reverse('shop:bale_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'A')
```

Run with:
```bash
python manage.py test
```

Django spins up a fresh test database, runs migrations, executes tests, and tears down. Tests are isolated — each test sees a clean database state — through transaction rollback.

The `Client` simulates a browser; it can GET, POST, login, and follow redirects. For API testing with DRF, `APIClient` adds JSON convenience.

The discipline of tests in Django:

**Test models for business rules.** If `Bale.full_clean()` should reject negative yards, write a test. If a `save()` override should set a derived field, write a test.

**Test views for the happy path and the unhappy path.** A list view: it returns 200 when authenticated, redirects when not, contains expected content, paginates when there are many records.

**Test forms for validation.** Submit invalid data; assert the form is invalid. Submit valid data; assert it saves.

**Use fixtures or factories.** `factory-boy` produces realistic test data without each test having to construct objects by hand.

**Run tests in CI.** Every pull request. Every commit to main. The same discipline as MEAN's CI: every change verified before it influences production.

---

### Letter 22: On When to Choose Django — and When Not To

Dear Reader,

I close, as I have closed each treatise, with the honest map.

**Choose Django when:**
- Your data is relational and benefits from a proper relational database.
- You need an admin interface for non‑developers.
- Your team knows Python or wants to learn it.
- You value being able to ship a complete application in days, not weeks.
- You want a single framework that includes auth, admin, ORM, migrations, forms.
- You are building anything where security defaults matter (Django's defaults are excellent).

**Choose differently when:**
- Your application is primarily a single‑page application talking to a JSON API. Django + DRF works, but Node + Express may feel more natural.
- Your application is real‑time and chat‑heavy. Django Channels is competent; Phoenix (Elixir) or Node may be better suited.
- Your team has deep expertise in Ruby (Rails), JavaScript (Express, NestJS), or Go (Gin, Echo).
- Your application is mostly CPU‑bound numerical computation. Python is slower than Go, Rust, or C++ for these — though numerical libraries (NumPy, SciPy) are written in C.

**Hybrid is common.** Django for the back‑office and JSON API; React or Vue for the customer‑facing SPA. Django for the heavy data‑modelled core; Go or Rust microservices for high‑concurrency edges. Django for the web; Celery + Pandas for batch processing. The framework plays well with others.

Django has carried Instagram from zero to a billion users; it has carried governmental tax systems for entire African countries; it has carried small clinics' patient records and large universities' admissions systems. The framework's twenty‑two‑year track record is its credential. The builder who learns it well learns a craft that will serve for another twenty.

---

## Epilogue: On the Old Framework That Still Carries Worlds

Dear Reader,

We began with a carpenter and his battered case of tools, and we have spent twenty‑two letters opening each compartment. The model that maps Python classes to database tables. The view that turns requests into responses. The template that turns data into HTML. The form that turns input into validated objects. The admin that turns models into a working back‑office in fifteen seconds. The authentication system that turns users into typed entities with permissions. The middleware that turns cross‑cutting concerns into composable layers. The REST framework that turns Django into a JSON server. The async views and Channels that turn Django into a real‑time platform. The deployment topology that turns a local development project into a service serving thousands of customers per second.

Django was built by a small newspaper team in Lawrence, Kansas, who needed to publish stories on tight deadlines. They were perfectionists with deadlines, and they built a framework in their own image. The "for perfectionists with deadlines" slogan is not marketing; it is autobiography.

The principles that made Django work in 2003 are the principles that make it work in 2025: batteries included, don't repeat yourself, explicit is better than implicit, pragmatic over pure. These principles have outlasted every framework that ridiculed them as old‑fashioned. They will outlast many of the frameworks currently in fashion.

For the African builder, Django offers a particular gift: a complete framework, free, well‑documented, with a security model that protects against the eight most common web vulnerabilities by default, in a language (Python) that scales from a first programming lesson to professional engineering, with an ecosystem (PyPI, scientific Python, machine learning) that connects to almost every domain a modern business touches. A team of three engineers in Nairobi, building Aminata's shop into a multi‑city operation, can do everything from the inventory system to the customer chat to the ML‑based demand forecasting in one stack, one language, one mental model. The carpenter's case opens; every tool is there.

I close, as I began, with awe at the deeper pattern. The same principle that lets a master carpenter build anything with a small case of well‑sharpened tools — *fewer tools, deeper mastery, more discipline* — is the principle that lets a small Django team build anything with one framework, one language, one consistent style. The same principle that lets a village chief inherit the apparatus of his office — *built once for the institution, used by every successor* — is the principle that lets a Django developer inherit the admin, the auth, the migrations, the templating. The principles are old. The substrate has changed; the structure has not.

May your models be true. May your views be predictable. May your migrations apply cleanly. May your admin save someone, one quiet afternoon, weeks of internal‑tool development.

Yours in the work,

— *Euler*
