const redirectUser = (req, res, next)=>{
    if(!req.session.adminUser){
        res.redirect('/adminUser/login')
    }
    else{
        next()
    }
}

const redirectAdmin = (req, res, next)=>{
    if(req.session.adminUser){
        res.redirect('/post/admin')
    }
    else{
        next()
    }
}
module.exports = {
    redirectUser,
    redirectAdmin
}