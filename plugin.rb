# name: Topic Organizer
# about: adds a custom button at the bottom of a topic, visible only to staff or members of a specific group
# version: 0.2
# authors: Jineet,Divya,Raghav
# url: https://github.com/jineetd/discourse-popup.git

enabled_site_setting :topic_organizer_enabled

PLUGIN_NAME ||= "discourse_topic_organizer".freeze

register_asset 'stylesheets/custom-public-button.css'

# load File.expand_path('../app/note_store.rb', __FILE__)

after_initialize do

  Topic.register_custom_field_type('next_topic_id',:text)
  Topic.register_custom_field_type('previous_topic_id',:text)
  add_to_serializer(:current_user, :can_see_topic_group_button?) do
    return true if scope.is_staff?
    group = Group.find_by("lower(name) = ?", SiteSetting.topic_group_button_allowed_group.downcase)
    return true if group && GroupUser.where(user_id: scope.user.id, group_id: group.id).exists?
  end
  # if SiteSetting.topic_organizer_enabled then
  #   add_to_serializer(:topic_view,:custom_fields,false){
  #     object.custom_fields
  #   }
  # end

  module ::DiscourseTopicOrganizer
    class Engine < ::Rails::Engine
      engine_name PLUGIN_NAME
      isolate_namespace DiscourseTopicOrganizer
    end
  end

  class DiscourseTopicOrganizer::Organizer
    class << self

      def next(topic_id,next_ids)
        set('next', topic_id,next_ids)
      end

      def previous(topic_id)
        set('previous', topic_id,topic_id)
      end

      def set(transaction, topic_id,next_ids) 
        DistributedMutex.synchronize("#{PLUGIN_NAME}-#{topic_id}") do
          topic = Topic.find_by_id(topic_id)

          # topic must not be deleted
          if topic.nil? || topic.trashed?
            raise StandardError.new I18n.t("topic.topic_is_deleted")
          end

          # topic must not be archived
          if topic.try(:archived)
            raise StandardError.new I18n.t("topic.topic_must_be_open_to_edit")
          end

          topic.custom_fields["#{transaction}_topic_id"] = next_ids
          topic.save!

          return topic
        end
      end
    end
  end

  require_dependency "application_controller"

  class DiscourseTopicOrganizer::OrganizerController < ::ApplicationController
    requires_plugin PLUGIN_NAME

    before_action :ensure_logged_in

    def next
      topic_id = params.require(:topic_id)
      next_ids = params.require(:next_ids)
      begin
        topic = DiscourseTopicOrganizer::Organizer.next(topic_id,next_ids)
        render json: { topic: topic }
      rescue StandardError => e
        render_json_error e.message
      end
    end

    def previous
      topic_id = params.require(:topic_id)

      begin
        topic = DiscourseTopicOrganizer::Organizer.previous(topic_id)
        render json: { topic: topic }
      rescue StandardError => e
        render_json_error e.message
      end
    end

  end

  DiscourseTopicOrganizer::Engine.routes.draw do
    put "/next" => "organizer#next"
    put "/previous" => "organizer#previous"
  end

  Discourse::Application.routes.append do
    mount ::DiscourseTopicOrganizer::Engine, at: "/topic"
  end

  # Discourse::Application.routes.append do
  #   # get '/notebook' => 'notebook#index'

  #   get '/notes' => 'notes#index'
  #   put '/notes/:topic_id' => 'notes#update'
  #   delete '/notes/:topic_id' => 'notes#destroy'
  # end
end
