import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, School, AlertOctagon, LogIn } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <Card className="w-full max-w-sm rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label>Email</Label>
              <Input className="mt-1.5 h-12 rounded-xl" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input className="mt-1.5 h-12 rounded-xl" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button className="h-14 rounded-2xl text-base font-semibold" onClick={() => setIsLoggedIn(true)}>
              <LogIn size={18} className="mr-2" /> Sign In
            </Button>
            <Button variant="ghost" className="h-10" onClick={() => navigate('/')}>← Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={() => { setIsLoggedIn(false); navigate('/'); }}>Logout</Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center p-4">
            <School className="text-primary" size={28} />
            <span className="mt-2 text-2xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">Total Schools</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center p-4">
            <Users className="text-primary" size={28} />
            <span className="mt-2 text-2xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">Students Tested</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center p-4">
            <AlertOctagon className="text-destructive" size={28} />
            <span className="mt-2 text-2xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">Total Referrals</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col items-center p-4">
            <BarChart3 className="text-secondary" size={28} />
            <span className="mt-2 text-2xl font-bold">0</span>
            <span className="text-xs text-muted-foreground">Sessions</span>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No sessions recorded yet. Start testing students to see data here.</p>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        © 2025 HearWise Technologies. Making hearing care accessible for every child in India.
      </p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        All student data is stored securely and used only for hearing health purposes.
      </p>
    </div>
  );
}
