export default class CommentEvent {
    channelPrefix = 'comment'
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

    openChannel = (postId) => {
        this._setChannel(postId)
        return this.pubsub.asyncIterator(this.channel)
    }

    _setChannel(postId) {
        this.channel = this.channelPrefix + `?postId=${postId}`
    }

    _publish = (mutation, comment) => {
        this._setChannel(comment.post)

        this.pubsub.publish(this.channel, {
            comment: {
                mutation: mutation,
                data: comment
            }
        })
    }
}