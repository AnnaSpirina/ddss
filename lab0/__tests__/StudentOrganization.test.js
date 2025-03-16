const StudentOrganization = require('../src/domain/entities/StudentOrganization');

describe('StudentOrganization Class', () => {
    let organization;

    beforeEach(() => {
        organization = new StudentOrganization(1, 'Организация 1', 'Описание', 1);
    });

    test('should create an organization with correct properties', () => {
        expect(organization.id).toBe(1);
        expect(organization.name).toBe('Организация 1');
        expect(organization.description).toBe('Описание');
        expect(organization.leaderId).toBe(1);
        expect(organization.members).toEqual([]);
        expect(organization.events).toEqual([]);
    });

    test('should assign a new leader', () => {
        organization.assignLeader(2);
        expect(organization.leaderId).toBe(2);
    });

    test('should add a member', () => {
        organization.addMember(2);
        expect(organization.members).toContain(2);
    });

    test('should add an event', () => {
        organization.addEvent(1);
        expect(organization.events).toContain(1);
    });
});