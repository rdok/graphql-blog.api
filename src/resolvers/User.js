const User = {
    email(parent, args, {user}, info) {
        const emailOwnedByLoggedInUser = user && user.email === parent.email
       
        return emailOwnedByLoggedInUser ? user.email : null
    }
}

export {User as default}