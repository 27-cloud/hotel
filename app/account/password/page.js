import PageProtected from '@/app/_components/PageProtected';
import UpdatePasswordForm from '@/app/_components/UpdatePasswordForm';

export const metadata = {
  title: 'Update password',
};

export default function Page() {
  return (
    <PageProtected>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your password
      </h2>
      <p className="text-lg mb-8 text-primary-200">
        Choose a strong password with at least 8 characters.
      </p>
      <UpdatePasswordForm />
    </PageProtected>
  );
}
