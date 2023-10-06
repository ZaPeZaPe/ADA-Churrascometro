export class Database {
    static registerUser(email, name, cep, check) {
        const data = { "email" : email, "name" : name, "cep" : cep, "check": check, "recipe": {}}
        localStorage.setItem(email, JSON.stringify(data))
        this.setLogged(email)
    }
    
    static addRecipe(recipe) {
        const user = localStorage.getItem("loggedAs")
        const userData = JSON.parse(localStorage.getItem(user || '{}'))
        if(!userData) { return false }
        
        userData["recipe"][`${Object.keys(userData["recipe"]).length+1}`] = recipe
        localStorage.setItem(user, JSON.stringify(userData))
        return true
    }
    
    static getSavedRecipiesFromUser() {
        return JSON.parse(localStorage.getItem(localStorage.getItem("loggedAs")|| '{}'))["recipe"]
    }

    static isInDatabase() {
        const user = JSON.parse(localStorage.getItem(localStorage.getItem("loggedAs")|| '{}'))
        return !!(user);
    }

    static setLogged(email) {
        localStorage.setItem("loggedAs", email)
    }

    static logout() {
        localStorage.setItem("loggedAs", "null")
    }
}
