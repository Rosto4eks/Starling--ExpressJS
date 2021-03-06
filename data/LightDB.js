let database = require('./database.json')
let chats = require('./chats.json')
const fs = require('fs')

callback = error => {
    if (error) console.log(error)
}

class User {

    constructor(login, name, password, role) {
        this.login = login
        this.name = name
        this.password = password
        this.role = role
    };

    find() {
        for (let element in database[1]) {
            if (this.login === element) {
                return true
            }
        }   
        return false  
    }

    // user save function
    save() {
        // checking if the user exists in the database
        if (this.find() === true) {
            return false
        }
        // if the user exists, add him to the database
        else {
            this.id = database[0].nextID
            database[1][this.login] = {"id": this.id,"name": this.name, "password": hash(this.password), "role": this.role}
            database[0]["nextID"]++
            fs.writeFile('data/database.json', JSON.stringify(database, null, 2), callback)
            fs.copyFile('public/images/starling.png', `public/avatars/${this.login}.jpg`, callback)
            return true
        }
    }
}

module.exports.User = User

module.exports.findUser = (login) => {
    for (let element in database[1]) {
        if (login === element) {
            return true
        }
    } 
    return false  
}

module.exports.deleteUser = (login) => {
    if (findUser(login) === true) {
        delete database[1][login]
        fs.writeFile('data/database.json', JSON.stringify(database, null, 2), callback)
        return true
    }
    else {
        console.log('not found')
        return false
    }
}

module.exports.changeUser = (login, property, newValue) => {
    if (findUser(login) === true) {
        switch( property ) {
            case "name":
                database[1][login].name = newValue
                fs.writeFile('data/database.json', JSON.stringify(database, null, 2), callback)
                return true
            case "password":
                database[1][login].password = hash(newValue);
                fs.writeFile('data/database.json', JSON.stringify(database, null, 2), callback);
                return true
            case "role":
                database[1][login].role = newValue;
                fs.writeFile('data/database.json', JSON.stringify(database, null, 2), callback);
                return true
            default: 
                console.log('error')
                return false
        }
    }
    else {
        console.log('not found')
        return false
    }
}

module.exports.checkPassword = (login, password) => {
    if (hash(password) === database[1][login].password) {
        return true
    }
    else {
        return false
    }
}

module.exports.getName = (login) => {
    return database[1][login].name
}

module.exports.getCount = () => {
    let count = 0
    for (let dataUser in database[1]) {
        count++
    }
    return count
}
  
module.exports.path = (min, max) => {
    let newPass= ''
    const symbols = 'mw3HQWGikeFaxCrcLoDUzXdEKslMjBbq4NhfI1pgA8PYyZ67Ru0TtnO2JS5Vv9'
    for (let counter = 0; counter <= randomInteger(min, max); counter++) {
        newPass += symbols[randomInteger(0, symbols.length-1)]
    }
    return newPass
}

module.exports.findChat = (name) => {
    for (let chat in chats) {
        if (name === chat) return true
    }
    return false
}

module.exports.saveChat = (uname, type, name, author, file) => {
    //uname - unique name /type private/public
    fs.copyFile('data/chats/exampleChat.json', `data/chats/${uname}.json`, callback)
    chats[uname] = {"href": `chats/${uname}`,"type": type, "name": name, "author": author}
    fs.writeFile('data/chats.json', JSON.stringify(chats, null, 2), callback)
    fs.mkdir(`public/uploads/${uname}`, callback)
    fs.readFile(file.path, (error, data) => {
        fs.writeFile(`public/chatAvatars/${uname}.jpg`, data, callback)
        fs.rm(file.path, (error) => {if (error) console.log(error)})
    })
    return true
}

hash = (password) => {
    let newPass= ''
    const symbols = 'mw3HQWGikeFaxCrcLoDUzXdEKslMjBbq4NhfI1pgA8PYyZ67Ru0TtnO2JS5Vv9'
    let even = 0
    for (let pass in password) {
        for (let symb in symbols) {
            if (password[pass] === symbols[symb]) {
                if (even%2 === 0) {
                    if (parseInt(symb) >= 60) {
                        newPass += symbols[parseInt(symb) - 15]
                        even ++  
                    }
                    else {
                        newPass += symbols[parseInt(symb) + 2]
                    even ++
                    }
                }
                else {
                    if (parseInt(symb) >= 58) {
                        newPass += symbols[parseInt(symb) - 12] + symbols[parseInt(symb) - 7]
                    even ++
                    }
                    else {
                        newPass += symbols[parseInt(symb) + 1] + symbols[parseInt(symb) + 4]
                    even ++
                    }
                }
            }
        }
    }
    return newPass
}

randomInteger = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}