//Проверка - существует ли студент с указанным ID.
function isStudentExists(studentId, students) {
    return students.some(student => student.id === studentId);
}

//Проверка - существует ли организация с указанным ID.
function isOrganizationExists(organizationId, organizations) {
    return organizations.some(org => org.id === organizationId);
}

//Проверка - существует ли мероприятие с указанным ID.
function isEventExists(eventId, events) {
    return events.some(event => event.id === eventId);
}

module.exports = {
    isStudentExists,
    isOrganizationExists,
    isEventExists,
};