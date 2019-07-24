# name: Topic Organizer
# about: adds a custom button at the bottom of a topic, visible only to staff or members of a specific group
# version: 0.2
# authors: Jineet,Divya,Raghav
# url: https://github.com/jineetd/discourse-popup.git

enabled_site_setting :topic_organizer_enabled

register_asset 'stylesheets/custom-public-button.css'

load File.expand_path('../app/note_store.rb', __FILE__)

after_initialize do
  load File.expand_path('../app/controllers/notes_controller.rb', __FILE__)
  add_to_serializer(:current_user, :can_see_topic_group_button?) do
    return true if scope.is_staff?
    group = Group.find_by("lower(name) = ?", SiteSetting.topic_group_button_allowed_group.downcase)
    return true if group && GroupUser.where(user_id: scope.user.id, group_id: group.id).exists?
  end

  Discourse::Application.routes.append do
    # get '/notebook' => 'notebook#index'

    get '/notes' => 'notes#index'
    put '/notes/:topic_id' => 'notes#update'
    delete '/notes/:topic_id' => 'notes#destroy'
  end
end
