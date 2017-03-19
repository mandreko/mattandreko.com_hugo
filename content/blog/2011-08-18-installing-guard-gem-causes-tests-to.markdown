---
title: "Installing Guard gem causes tests to fail - Solved"
date: "2011-08-18T09:14:00-04:00"
comments: true
highlight: "true"
categories:
 - rspec
 - rails
 - cucumber
---

I was tinkering with a new rails application, using [RSpec2](http://relishapp.com/rspec) and [Cucumber](http://cukes.info) for my testing. I was able to run all my tests by typing:

```
rake spec
rake cucumber
```

This worked perfectly, but every time I'd make a change, I'd have to run both commands.  So I looked into the [Guard](https://github.com/guard/guard) gem, after watching the excellent [RailsCast](http://railscasts.com/episodes/264-guard) by Ryan Bates. 

<!-- more -->

I started by adding to my gemfile:

```
gem 'guard-spork'
gem 'guard-rspec'
gem 'guard-cucumber'
```

Then to configure guard, I ran:

```
bundle
guard init rspec
guard init cucumber
```

So I went and ran the guard executable, only to see failures in both RSpec and Cucumber!<br /><br />After much research, I found that my data was persisting between tests for some reason.  I had the [database_cleaner](https://github.com/bmabey/database_cleaner) gem, so I didn't understand why.  I eventually found a line in both /spec/spec_helper.rb and /features/support/env.rb showing:

```
DatabaseCleaner.strategy = :transaction
```

Everything seemed to work correctly when I changed it to (in both places):

```
DatabaseCleaner.clean_with :truncation
```

I'm not exactly sure why this works. Maybe the transaction method doesn't work well with sqlite, but it did manage to fix me up.
