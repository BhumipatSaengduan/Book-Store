import React, { useState } from 'react';

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

const AddressBook: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setAddresses(prev => [...prev, { ...newAddress, id: Date.now() }]);
    setNewAddress({ name: '', street: '', city: '', postalCode: '', country: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">สมุดที่อยู่</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newAddress.name}
            onChange={handleInputChange}
            placeholder="ชื่อ"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            name="street"
            value={newAddress.street}
            onChange={handleInputChange}
            placeholder="ที่อยู่"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleInputChange}
            placeholder="เมือง"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            name="postalCode"
            value={newAddress.postalCode}
            onChange={handleInputChange}
            placeholder="รหัสไปรษณีย์"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            name="country"
            value={newAddress.country}
            onChange={handleInputChange}
            placeholder="ประเทศ"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          เพิ่มที่อยู่
        </button>
      </form>
      <div>
        {addresses.map(address => (
          <div key={address.id} className="bg-white p-4 rounded-md shadow mb-4">
            <h3 className="font-bold">{address.name}</h3>
            <p>{address.street}</p>
            <p>{address.city}, {address.postalCode}</p>
            <p>{address.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBook;