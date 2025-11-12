import { LoginFlow } from './components/LoginFlow';

export default function App() {
  return (
    <div className="p-8">
      <LoginFlow
        onSuccess={(data) => {
          console.log('Authentication successful!');
          console.log('JWT:', data.jwt);
          console.log('Data Token ID:', data.dataTokenId);
        }}
      />
    </div>
  );
}
