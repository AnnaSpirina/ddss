class User {
    constructor({ id, email, password, firstName, lastName, middleName, studyGroup, role }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.studyGroup = studyGroup;
        this.role = role;
    }

    isAdmin() {
        return this.role === 'admin';
    }

    isContentManager() {
        return this.role === 'content_manager';
    }

    isStudent() {
        return this.role === 'student';
    }
}

module.exports = User;