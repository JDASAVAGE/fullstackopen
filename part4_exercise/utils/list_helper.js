const dummy = (blogs) => {
    return 1
  }

const totalLikes=(blogs)=>{
    let totalLikes=0
    blogs.forEach(blog => {
        likes=blog['likes']
        totalLikes+=likes
    });
    return totalLikes
}

const favoriteBlog=(blogs)=>{
    if(blogs.length==0){
        return null
    }
    var chosenBlog=blogs[0]
    blogs.forEach(blog=>{
        if(blog['likes']>chosenBlog['likes']){
            chosenBlog=blog
        }
    })
    result={
        title:chosenBlog["title"],
        author:chosenBlog["author"],
        likes:chosenBlog["likes"]
    }
    return result
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        let authorTally = blogs.reduce((authorTally, blog) => {
            authorTally[blog.author] = (authorTally[blog.author] || 0) + 1
            return authorTally
        }, {})
        let highestCount = Math.max(...Object.values(authorTally))
        let mostOften = Object.keys(authorTally).filter(author => authorTally[author] === highestCount)
        return {
            author: mostOften[0],
            blogs: highestCount
        }
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        let authorTally = blogs.reduce((authorTally, blog) => {
            authorTally[blog.author] = (authorTally[blog.author] || 0) + blog.likes
            return authorTally
        }, {})
        let highestCount = Math.max(...Object.values(authorTally))
        let highestLikes = Object.keys(authorTally).filter(author => authorTally[author] === highestCount)
        return {
            author: highestLikes[0],
            blogs: highestCount
        }
    }
}

module.exports = {dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes}