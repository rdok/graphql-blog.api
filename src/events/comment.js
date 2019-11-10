export default class CommentEvent {
    channel = 'comment'
    createdMutation = 'CREATED'
    updatedMutation = 'UPDATED'
    deletedMutation = 'DELETED'

    constructor({ pubsub }) {
        this.pubsub = pubsub
    }

    publishCreated = (comment) => {
        this._publish(this.createdMutation, comment)
    }

    publishUpdated = (comment) => {
        this._publish(this.updatedMutation, comment)
    }

    publishDeleted = (comment) => {
        this._publish(this.deletedMutation, comment)
    }

    openChannel = () => {
        return this.pubsub.asyncIterator(this.channel)
    }

    _publish = (mutation, comment) => {
        this.pubsub.publish(this.channel, {
            comment: {
                mutation: mutation,
                data: comment
            }
        })
    }
}