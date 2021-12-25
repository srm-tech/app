// import { getCollection, getDb, ObjectId } from '@/lib/db';
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
import { connectToDatabase } from '@/lib/db';

export default async () => {
  const { db } = await connectToDatabase();
  return {
    DashBoardConnectionsWidget: DashBoardConnectionsWidget(
      db.collection('connections')
    ),
    DashboardIntroductionsWidget: DashboardIntroductionsWidget(
      db.collection('introductions')
    ),
    DashboardInvitationsWidget: DashboardInvitationsWidget(
      db.collection('invitations')
    ),
    Agreement: Agreement(db.collection('agreements')),
    BusinessInvitations: BusinessInvitations(
      db.collection('businessInvitations')
    ),
    Category: Category(db.collection('category')),
    Connection: Connection(db.collection('connections')),
    Favourite: Favourite(db.collection('favourites')),
    Introduction: Introduction(db.collection('introductions')),
    Invitation: Invitation(db.collection('invitations')),
    Message: Message(db.collection('messages')),
    MyContacts: MyContacts(db.collection('userProfiles')),
    Review: Review(db.collection('reviews')),
    UserProfile: UserProfile(db.collection('userProfiles')),
  };
};
