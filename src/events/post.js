export default class PostEvent {
    channel = 'post'
    createdMutation = 'CREATED'
    updatedMutation = 'UPDATED'
    deletedMutation = 'DELETED'

    constructor({ pubsub }) {
        this.pubsub = pubsub
    }

    publishCreated = (post) => {
        if (this._shouldNotPublish(post)) { return }
        this._publish(this.createdMutation, post)
    }

    publishUpdated = (post) => {
        if (this._shouldNotPublish(post)) { return }
        this._publish(this.updatedMutation, post)
    }

    publishDeleted = (post) => {
        if (this._shouldNotPublish(post)) { return }
        this._publish(this.deletedMutation, post)
    }

    openChannel = () => {
        return this.pubsub.asyncIterator(this.channel)
    }

    _shouldNotPublish = (post) => {
        return post.published !== true
    }

    _publish = (mutation, post) => {
        this.pubsub.publish(this.channel, {
            post: {
                mutation: mutation,
                data: post
            }
        })
    }
}