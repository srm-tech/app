import { getCollection, getDb, ObjectId } from '@/lib/db';
import DashBoardConnectionsWidget from './widgets/DashboardConnections';
import DashboardIntroductionsWidget from './widgets/DashboardIntroductions';
import DashboardInvitationsWidget from './widgets/DashboardInvitations';
import Agreement from './Agreement';
import BusinessInvitations from './BusinessInvitations';
import Category from './Category';
import Connection from './Connections';
import Favourite from './Favourites';
import Introduction from './Introduction';
import Invitation from './Invitations';
import Message from './Messages';
import MyContacts from './MyContacts';
import Review from './Reviews';
import UserProfile from './UserProfiles';

const db = getDb();
const collection = getCollection(db);

export default {
  client: db.client,
  DashBoardConnectionsWidget: DashBoardConnectionsWidget(
    collection('connections')
  ),
  DashboardIntroductionsWidget: DashboardIntroductionsWidget(
    collection('introductions')
  ),
  DashboardInvitationsWidget: DashboardInvitationsWidget(
    collection('invitations')
  ),
  Agreement: Agreement(collection('agreements')),
  BusinessInvitations: BusinessInvitations(collection('businessInvitations')),
  Category: Category(collection('category')),
  Connection: Connection(collection('connections')),
  Favourite: Favourite(collection('favourites')),
  Introduction: Introduction(collection('introductions')),
  Invitation: Invitation(collection('invitations')),
  Message: Message(collection('messages')),
  MyContacts: MyContacts(collection('userProfiles')),
  Review: Review(collection('reviews')),
  UserProfile: UserProfile(collection('userProfiles')),
};
