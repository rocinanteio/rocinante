import { redirect } from 'next/navigation';

export default async function HomePage(props) {
  redirect('/reviewapps');
}
