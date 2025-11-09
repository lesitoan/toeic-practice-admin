

// Table columns configuration
export const USER_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
    render: (value, item) => {
      const hasAvatar = item.avatar && item.avatar.trim() !== '' && new RegExp('^(https?://.*\\.(?:png|jpg|jpeg|gif|webp|svg|bmp))(?:\\?.*)?$').test(item.avatar);
      const initials = value && value !== '-' 
        ? value.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
        : 'U';

        const avatar =hasAvatar ? item.avatar :  '/image/defaultAvt.jpg';
      
      return (
        <div className="flex items-center">
          {true ? (
            <img
              className="h-10 w-10 rounded-full bg-gray-50 object-cover flex-shrink-0"
              src={avatar}
              alt={value || 'User'}
              onError={(e) => {
                // Hide image and show fallback if image fails to load
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />
          ) : null}
          
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{item.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        value === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    ),
  },
  {
    key: 'testsTaken',
    label: 'Tests Taken',
  },
  {
    key: 'averageScore',
    label: 'Avg Score',
    render: (value) => (
      <span className="text-sm font-medium text-gray-900">{value}</span>
    ),
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    render: (value) => (
      <span className="text-sm text-gray-500">{value}</span>
    ),
  },
];

// User statuses
export const USER_STATUSES = [
  { value: 'Active', label: 'Active', color: 'green' },
  { value: 'Inactive', label: 'Inactive', color: 'gray' },
  { value: 'Suspended', label: 'Suspended', color: 'red' },
  { value: 'Pending', label: 'Pending', color: 'yellow' },
];
