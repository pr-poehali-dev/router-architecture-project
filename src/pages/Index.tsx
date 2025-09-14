import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface BankAccount {
  id: number;
  balance: number;
}

const Index = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Game state
  const [gameNumber, setGameNumber] = useState(Math.floor(Math.random() * 11));
  const [userGuess, setUserGuess] = useState('');
  const [gameResult, setGameResult] = useState('');
  const [gameHistory, setGameHistory] = useState<string[]>([]);

  // Bank state
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: 0, balance: 100 },
    { id: 1, balance: 200 },
    { id: 2, balance: 0 }
  ]);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');

  const handleLogin = () => {
    if (password === '123') {
      setIsAuthenticated(true);
      toast.success('Добро пожаловать в систему!');
    } else {
      toast.error('Неверный пароль. Используйте: 123');
    }
  };

  const handleGuess = () => {
    const guess = parseInt(userGuess);
    if (isNaN(guess) || guess < 0 || guess > 10) {
      toast.error('Введите число от 0 до 10');
      return;
    }

    const isCorrect = guess === gameNumber;
    const result = isCorrect ? `Угадали! Число было ${gameNumber}` : `Не угадали. Было ${gameNumber}, вы ввели ${guess}`;
    setGameResult(result);
    setGameHistory(prev => [result, ...prev.slice(0, 4)]);
    
    // Generate new number
    setGameNumber(Math.floor(Math.random() * 11));
    setUserGuess('');
    
    if (isCorrect) {
      toast.success('Поздравляем! Вы угадали число!');
    }
  };

  const addAccount = () => {
    const balance = parseInt(newAccountBalance) || 0;
    const newId = bankAccounts.length;
    setBankAccounts(prev => [...prev, { id: newId, balance }]);
    setNewAccountBalance('');
    toast.success(`Счёт #${newId} создан с балансом ${balance}₽`);
  };

  const updateBalance = () => {
    const amount = parseInt(transactionAmount);
    if (isNaN(amount)) {
      toast.error('Введите корректную сумму');
      return;
    }

    setBankAccounts(prev =>
      prev.map(acc =>
        acc.id === selectedAccount
          ? { ...acc, balance: acc.balance + amount }
          : acc
      )
    );
    setTransactionAmount('');
    toast.success(`${amount > 0 ? 'Пополнение' : 'Списание'} ${Math.abs(amount)}₽ по счёту #${selectedAccount}`);
  };

  const deleteAccount = (accountId: number) => {
    setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
    toast.success(`Счёт #${accountId} удалён`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md fade-in">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Lock" size={32} className="text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold">Вход в систему</CardTitle>
            <CardDescription>Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Подсказка: пароль "123"
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Панель управления</h1>
              <p className="text-slate-600">Добро пожаловать в систему управления</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
              className="gap-2"
            >
              <Icon name="LogOut" size={18} />
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Number Guessing Game */}
          <Card className="fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="Dice6" size={20} className="text-green-600" />
                </div>
                <div>
                  <CardTitle>Угадай число</CardTitle>
                  <CardDescription>От 0 до 10</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ваше число"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  min="0"
                  max="10"
                />
                <Button onClick={handleGuess}>
                  Угадать
                </Button>
              </div>
              
              {gameResult && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium">{gameResult}</p>
                </div>
              )}

              {gameHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">История игр:</h4>
                  <div className="space-y-1">
                    {gameHistory.map((result, index) => (
                      <div key={index} className="text-xs text-slate-600 p-2 bg-slate-50 rounded">
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Management */}
          <Card className="lg:col-span-2 fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={20} className="text-blue-600" />
                </div>
                <div>
                  <CardTitle>Банковские счета</CardTitle>
                  <CardDescription>Управление счетами и балансами</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Account */}
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Начальный баланс"
                  value={newAccountBalance}
                  onChange={(e) => setNewAccountBalance(e.target.value)}
                />
                <Button onClick={addAccount} className="gap-2">
                  <Icon name="Plus" size={16} />
                  Создать счёт
                </Button>
              </div>

              {/* Account List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">Счёт #{account.id}</h4>
                        <div className="flex items-center gap-2">
                          <Icon name="Wallet" size={16} className="text-slate-500" />
                          <span className={`text-lg font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {account.balance}₽
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAccount(account.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold">Операция по счёту</h4>
                <div className="flex gap-2">
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(parseInt(e.target.value))}
                    className="px-3 py-2 border rounded-md"
                  >
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        Счёт #{account.id} ({account.balance}₽)
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    placeholder="Сумма (+/-)"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateBalance()}
                  />
                  <Button onClick={updateBalance} className="gap-2">
                    <Icon name="ArrowUpDown" size={16} />
                    Выполнить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;