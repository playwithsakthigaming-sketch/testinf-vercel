
export type ApplicationStatus = 'Pending' | 'Accepted' | 'Rejected';

export type Application = {
  id: string;
  name: string;
  discordTag?: string; // Made optional
  email: string;
  steamUrl?: string; // Made optional
  truckersmpUrl?: string;
  truckershubUrl?: string;
  experience?: 'fresher' | 'experienced'; // Made optional
  howYouFound?: 'truckersmp' | 'friends' | 'others'; // Made optional
  friendsMention?: string;
  othersMention?: string;
  status: ApplicationStatus;
  submittedAt: string;
};

export type ApplicationsData = {
  applications: Application[];
};
