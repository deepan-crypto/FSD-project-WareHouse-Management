
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  ALLOCATED: 'allocated',
  PICKING: 'picking',
  PACKING: 'packing',
  READY: 'ready',
  DISPATCHED: 'dispatched',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.ALLOCATED]: 'Allocated',
  [ORDER_STATUS.PICKING]: 'Picking',
  [ORDER_STATUS.PACKING]: 'Packing',
  [ORDER_STATUS.READY]: 'Ready',
  [ORDER_STATUS.DISPATCHED]: 'Dispatched',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.ON_HOLD]: 'On Hold'
};

// Priority Levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High',
  [PRIORITY.URGENT]: 'Urgent'
};

// User Roles
export const USER_ROLES = {
  STAFF: 'staff',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin'
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.STAFF]: 'Staff',
  [USER_ROLES.SUPERVISOR]: 'Supervisor',
  [USER_ROLES.ADMIN]: 'Admin'
};

// Inventory Transaction Types
export const TRANSACTION_TYPES = {
  RECEIVE: 'receive',
  PICK: 'pick',
  ADJUST: 'adjust',
  RESERVE: 'reserve',
  RELEASE: 'release',
  RETURN: 'return'
};

// Report Types
export const REPORT_TYPES = {
  PRODUCTIVITY: 'productivity',
  DELAYS: 'delays',
  ERRORS: 'errors',
  INVENTORY: 'inventory',
  CUSTOM: 'custom'
};

// Pagination
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  SHORT: 'MM/dd/yyyy'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'warehouse_auth_token',
  USER_DATA: 'warehouse_user_data',
  THEME: 'warehouse_theme'
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#2563eb',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#3b82f6',
  PURPLE: '#7c3aed',
  PINK: '#ec4899',
  INDIGO: '#6366f1'
};

// Status Colors Mapping
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.ALLOCATED]: 'info',
  [ORDER_STATUS.PICKING]: 'purple',
  [ORDER_STATUS.PACKING]: 'pink',
  [ORDER_STATUS.READY]: 'success',
  [ORDER_STATUS.DISPATCHED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
  [ORDER_STATUS.ON_HOLD]: 'warning'
};

// Priority Colors Mapping
export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: 'success',
  [PRIORITY.MEDIUM]: 'warning',
  [PRIORITY.HIGH]: 'orange',
  [PRIORITY.URGENT]: 'danger'
};

// Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
  TRACKING: 5000,
  INVENTORY: 30000,
  ORDERS: 10000 
};
