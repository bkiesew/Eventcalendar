import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const PackageCalculator = () => {
  const [attendees, setAttendees] = useState(100);
  const [days, setDays] = useState(2);
  const [selectedTents, setSelectedTents] = useState({
    deluxeDouble: 0,
    deluxe: 0,
    standard: 0,
    basicDouble: 0,
  });
  const [fbPackage, setFbPackage] = useState(null);

  const tentTypes = {
    deluxeDouble: {
      name: 'Deluxe Double Tent',
      capacity: 4,
      available: 6,
      description: 'Premium tent with 2 queen beds'
    },
    deluxe: {
      name: 'Deluxe Single',
      capacity: 2,
      available: 6,
      description: 'Premium tent with 1 queen bed'
    },
    standard: {
      name: 'Standard',
      capacity: 2,
      available: 20,
      description: 'Comfortable tent with 1 full bed'
    },
    basicDouble: {
      name: 'Basic Double',
      capacity: 2,
      available: 18,
      description: '2 twin beds'
    }
  };

  const getPackagePrice = (attendees) => {
    // Base prices before margin
    const basePrice = attendees <= 50 ? 18700 :
                     attendees <= 100 ? 21300 :
                     attendees <= 150 ? 29800 :
                     35700;
    
    // Add 50% margin
    return basePrice * 1.5;
  };

  const calculateTentCosts = () => {
    const totalTents = Object.values(selectedTents).reduce((sum, count) => sum + count, 0);
    const dailyRate = 150;
    const setupFee = 150;
    return (totalTents * dailyRate * days) + (totalTents * setupFee);
  };

  const calculateTotalCapacity = () => {
    return Object.entries(selectedTents).reduce((sum, [type, count]) => {
      return sum + (count * tentTypes[type].capacity);
    }, 0);
  };

  const calculateFBCost = () => {
    if (!fbPackage) return 0;
    if (fbPackage === 'byoc') return 1200 * days;
    const rate = fbPackage === 'standard' ? 50 : 65;
    return rate * attendees * days;
  };

  const calculateTotal = () => {
    const basePackage = getPackagePrice(attendees);
    const tentCosts = calculateTentCosts();
    const fbCosts = calculateFBCost();
    const subtotal = basePackage + tentCosts + fbCosts;
    
    // Calculate individual tax and fee components
    const occupancyTax = subtotal * 0.12; // 12% occupancy tax
    const salesTax = subtotal * 0.0875; // 8.75% sales tax
    const adminFee = subtotal * 0.04; // 4% admin fee
    
    return {
      basePackage,
      tentCosts,
      fbCosts,
      subtotal,
      taxes: {
        occupancyTax,
        salesTax,
        adminFee
      },
      total: subtotal + occupancyTax + salesTax + adminFee
    };
  };

  const totals = calculateTotal();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Package Estimator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Basic Details */}
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Number of Guests</label>
              <input
                type="number"
                min="50"
                max="200"
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Days</label>
              <input
                type="number"
                min="1"
                max="7"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Glamping Options */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Glamping Accommodations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(tentTypes).map(([type, details]) => (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{details.name}</h4>
                      <p className="text-sm text-gray-600">{details.description}</p>
                      <p className="text-sm">Capacity: {details.capacity} people</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max={details.available}
                        value={selectedTents[type]}
                        onChange={(e) => setSelectedTents(prev => ({
                          ...prev,
                          [type]: parseInt(e.target.value) || 0
                        }))}
                        className="w-20 p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    ${150}/night + $150 setup fee
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <div className="flex justify-between items-center">
                <span>Total Sleeping Capacity:</span>
                <span className="font-medium">{calculateTotalCapacity()} people</span>
              </div>
            </div>
          </div>

          {/* Food & Beverage */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Food & Beverage Options</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${fbPackage === 'standard' ? 'border-blue-500' : ''}`}
                onClick={() => setFbPackage('standard')}
              >
                <h4 className="font-medium">Standard Package</h4>
                <p className="text-xl font-bold mb-2">$50 per person/day</p>
                <ul className="text-sm space-y-1">
                  <li>• Breakfast & Lunch Service</li>
                  <li>• Dinner Service</li>
                  <li>• Snack Station</li>
                  <li>• Basic Beverage Service</li>
                  <li>• Service Staff Included</li>
                </ul>
              </div>
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${fbPackage === 'premium' ? 'border-blue-500' : ''}`}
                onClick={() => setFbPackage('premium')}
              >
                <h4 className="font-medium">Premium Package</h4>
                <p className="text-xl font-bold mb-2">$65 per person/day</p>
                <ul className="text-sm space-y-1">
                  <li>• Enhanced Menu Selection</li>
                  <li>• Premium Dining Experience</li>
                  <li>• Extended Service Hours</li>
                  <li>• Premium Beverage Service</li>
                  <li>• Dedicated Service Staff</li>
                </ul>
              </div>
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${fbPackage === 'byoc' ? 'border-blue-500' : ''}`}
                onClick={() => setFbPackage('byoc')}
              >
                <h4 className="font-medium">Bring Your Own Chef</h4>
                <p className="text-xl font-bold mb-2">$1,200 per day</p>
                <ul className="text-sm space-y-1">
                  <li>• Commercial Kitchen Access</li>
                  <li>• Professional Equipment</li>
                  <li>• Refrigeration</li>
                  <li>• Storage Space</li>
                  <li className="text-red-600">• Must provide own consumables</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Estimated Costs</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Package:</span>
                <span>${Math.round(totals.basePackage).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Glamping Accommodations:</span>
                <span>${Math.round(totals.tentCosts).toLocaleString()}</span>
              </div>
              {totals.fbCosts > 0 && (
                <div className="flex justify-between">
                  <span>Food & Beverage:</span>
                  <span>${Math.round(totals.fbCosts).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="text-sm font-medium mb-2">Taxes & Fees:</div>
                <div className="space-y-1 pl-4">
                  <div className="flex justify-between text-sm">
                    <span>Occupancy Tax (12%):</span>
                    <span>${Math.round(totals.taxes.occupancyTax).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sales Tax (8.75%):</span>
                    <span>${Math.round(totals.taxes.salesTax).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Administrative Fee (4%):</span>
                    <span>${Math.round(totals.taxes.adminFee).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                <span>Total Estimated Cost:</span>
                <span>${Math.round(totals.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageCalculator;
