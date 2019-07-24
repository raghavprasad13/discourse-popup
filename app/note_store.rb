class NoteStore
  class << self
    def get_notes
      PluginStore.get('discourse-topic-organizer', 'notes') || {}
    end

    def add_note(topic_id, note)
      notes = get_notes()
      notes[topic_id] = note
      PluginStore.set('discourse-topic-organizer', 'notes', notes)

      note
    end

    def remove_note(topic_id)
      notes = get_notes()
      notes.delete(topic_id)
      PluginStore.set('discourse-topic-organizer', 'notes', notes)
    end
  end
end
