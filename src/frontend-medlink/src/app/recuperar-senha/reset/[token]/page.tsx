import ResetPasswordClient from './ResetPasswordClient';

interface Props {
  params: { token: string };
}

export default function ResetPage({ params }: Props) {
  const { token } = params;
  return <ResetPasswordClient token={token} />;
}
