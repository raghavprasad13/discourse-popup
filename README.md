discourse-topic-organizer
=======================

Adds a custom button in the admin menu, visible only to staff or members of a specific group.

Configuration
=====

From Admin > Site Settings > Plugin, modify `topic_organizer_button_title`, `topic_organizer_button_label`, `topic_organizer_tl_lock_minimum`.

Installation
============

* Add the plugin's repo url to your container's `app.yml` file

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/discourse/discourse-topic-organizer.git
```

* Rebuild the container

```
cd /var/docker
git pull
./launcher rebuild app
```

License
=======
[License](https://github.com/jineetd/discourse-topic-organizer/blob/master/LICENSE)
