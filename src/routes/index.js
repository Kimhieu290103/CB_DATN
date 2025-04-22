import LoginLayout from '@/layout/auth/login-layout'

import URLS from './urls'

import Login from '@/pages/auth/login'
import NotAuthorized from '@/pages/auth/not-authorized'
import EventsList from '@/pages/events/events-list'
import OTPAuth from '@/pages/auth/OTP_auth'
import EventDetail from '@/pages/events/event-detail'
import EventRegistration from '@/pages/events/event-registration'
import NewEvent from '@/pages/events/new-event'
import EventJoinedStudent from '@/pages/events/event-joined-student'
import EditEvent from '@/pages/events/edit-event'
import CommunityScoreList from '@/pages/community_score/score_list'
import ExternalEvent from '@/pages/events/external-event'
import ExcellentStudentsList from '@/pages/excellent-students/excellent-students-list'
import StudentCriterias from '@/pages/excellent-students/student-criterias'
import AllEvents from '@/pages/events/all-event'
import AccountManager from '@/pages/account-manager/account'
import ExcellentStudentsListNavNav from '@/pages/excellent-students/excellent-students-list-nav'
import ExcellentLcdList from '@/pages/excellent-students/excellent-lcd-list'
import AccountStudentList from '@/pages/account-manager/account-sv'
import AccountLcdList from '@/pages/account-manager/account-lcd'
import AccountAdminList from '@/pages/account-manager/account-admin'
import ClassManagement from '@/pages/class-manager/class-manager'
const publicRoutes = [
    {path: '/', element: Login, Layout: LoginLayout},
    {path: '/not-authorized', element: NotAuthorized, Layout: LoginLayout},
    {path: '/OTP', element: OTPAuth, Layout: LoginLayout},
]

const privateRoutes = [
    {path: URLS.ALL_EVENTS, element: AllEvents, roles: ['HSV', 'CTSV', 'BTV','LCD']},
    {path: URLS.ALL_EVENTS_DETAILS, element: EventDetail, roles: ['HSV', 'CTSV', 'BTV','LCD']},
    {path: URLS.ALL_EVENTS_REGISTRATION, element: EventRegistration, roles: ['HSV', 'CTSV', 'BTV','LCD']},
    {path: URLS.MANAGE_EVENTS, element: EventsList},
    {path: URLS.EVENT_DETAILS, element: EventDetail},
    {path: URLS.EVENT_REGISTRATION, element: EventRegistration},
    {path: URLS.JOINED_EVENTS, element: EventJoinedStudent},
    {path: URLS.NEW_EVENT, element: NewEvent},
    {path: URLS.EDIT_EVENT, element: EditEvent},
    {path: URLS.EXTERNAL_ACTIVITIES, element: ExternalEvent, roles: ['HSV', 'CTSV', 'BTV']},
    {path: URLS.COMMUNITY_SCORE, element: CommunityScoreList, roles: ['HSV', 'CTSV', 'BTV']},
    {path: URLS.EXCELLENT_STUDENTS, element: ExcellentStudentsList, roles: ['HSV', 'BTV']},
    {path: URLS.STUDENT_CRITERIA, element: StudentCriterias, roles: ['HSV', 'BTV']},
    {path: URLS.ACCOUNT_MANAGEMENT, element: AccountManager, roles: ['HSV', 'BTV', 'BTV', 'CTSV']},
    {path: URLS.EXCELLENT_STUDENTS_NAV, element: ExcellentStudentsListNavNav, roles: ['HSV', 'BTV', 'BTV', 'CTSV']},
    {path: URLS.EXCELLENT_LCD, element: ExcellentLcdList, roles: ['HSV', 'BTV', 'BTV', 'CTSV']},
    {path: URLS.ACCOUNT_SV, element: AccountStudentList, roles: ['HSV', 'BTV', 'BTV', 'CTSV']},
    {path: URLS.ACCOUNT_LCD, element: AccountLcdList, roles: ['HSV', 'BTV', 'BTV', 'CTSV']},
    {path: URLS.ACCOUNT_ADMIN, element: AccountAdminList, roles: ['HSV', 'BTV', 'BTV', 'CTSV']},
    {path: URLS.CLASS_MANAGEMENT, element: ClassManagement, roles: ['HSV', 'BTV', 'BTV', 'CTSV']},
]

export { publicRoutes, privateRoutes }