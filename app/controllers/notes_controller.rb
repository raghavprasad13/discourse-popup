class NotesController < ApplicationController
  def index
    Rails.logger.info 'Called NotesController#index'
    notes = NoteStore.get_notes()

    render json: { notes: notes.values }
  end

  def update
    Rails.logger.info 'Called NotesController#update'

    topic_id = params[:topic_id]
    note = {
      'id' => topic_id,
      'prior_topic_id' => params[:note][:prior_topic_id],
      'next_topic_id' => params[:note][:next_topic_id],
      'sequence_on' => params[:note][:sequence_on]
    }

    NoteStore.add_note(topic_id, note)

    render json: { note: note }
  end

  def destroy
    Rails.logger.info 'Called NotesController#destroy'

    NoteStore.remove_note(params[:topic_id])

    render json: success_json
  end
end
