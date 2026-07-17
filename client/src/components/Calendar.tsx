import { useEffect, useState, useRef } from 'react';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon, PackageIcon, ImageIcon, PlusIcon, TrashIcon, XIcon, AlertCircleIcon, SearchIcon, ChevronDownIcon, CalendarIcon, ListIcon, MoreHorizontalIcon, ChevronUpIcon } from 'lucide-react';
import { usePantry } from '../contexts/pantryContext';
import { MealPlan, Recipe } from '../api/types';
interface CalendarProps {
  onBack: () => void;
}
export function Calendar({
  onBack
}: CalendarProps) {
  const {
    addMealPlan,
    deleteMealPlan,
    fetchAllMealPlans,
    fetchAllRecipes
  } = usePantry();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showRecipeDetailModal, setShowRecipeDetailModal] = useState(false);
  const [selectedRecipeForDetail, setSelectedRecipeForDetail] = useState<Recipe | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<any>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // New state for view toggle
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  // List view week navigation state
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // Initialize to the start of the current week (Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek); // Go back to Sunday
    startDate.setHours(0, 0, 0, 0); // Start of day
    return startDate;
  });
  const [expandedDateGroups, setExpandedDateGroups] = useState<string[]>([]);
  const [showItemActions, setShowItemActions] = useState<string | null>(null);
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  // New state for notification
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Get day of week of first day of month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  useEffect(() => {
    const fetchMealPlans = async () => {
      const plans = await fetchAllMealPlans();
      setMealPlans(plans || []);
    };
    const fetchReceipes = async () => {
      const fetchedRecipes = await fetchAllRecipes();
      setRecipes(fetchedRecipes);
    };
    fetchMealPlans();
    fetchReceipes();
  }, []);
  // Create array of days for the calendar
  const calendarDays = Array.from({
    length: 42
  }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return dayNumber;
    }
    return null;
  });
  // Format date to YYYY-MM-DD for comparison
  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  // Format date from Date object to YYYY-MM-DD
  const formatDateObj = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  // Get cooking history for selected date
  const getHistoryForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateString = formatDateString(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    return mealPlans.filter((item: MealPlan) => item.serving_date === dateString);
  };
  // Group history by meal type
  const getHistoryByMealType = () => {
    const history = getHistoryForSelectedDate();
    return {
      breakfast: history.filter((item: MealPlan) => item.meal_type === 'breakfast'),
      lunch: history.filter((item: MealPlan) => item.meal_type === 'lunch'),
      dinner: history.filter((item: MealPlan) => item.meal_type === 'dinner'),
      snack: history.filter((item: MealPlan) => item.meal_type === 'snack')
    };
  };
  // Navigation functions
  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
  };
  const handleDayClick = (day: number | null) => {
    if (!day) return;
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };
  // Month names for header
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // Day names for header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Get meal type color
  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-sage/50 border-blue-100 text-blue-700';
      case 'lunch':
        return 'bg-sage/50 border-amber-100 text-muted';
      case 'dinner':
        return 'bg-sage/50 border-line text-herb-deep';
      case 'snack':
        return 'bg-sage/50 border-line text-herb-deep';
      default:
        return 'bg-linen border-line text-ink';
    }
  };
  const getMealTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  // Get meal type indicator color
  const getMealTypeIndicatorColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-sage/500';
      case 'lunch':
        return 'bg-sage/500';
      case 'dinner':
        return 'bg-herb';
      case 'snack':
        return 'bg-sage/500';
      default:
        return 'bg-linen0';
    }
  };

  // Handle add recipe
  const handleOpenAddRecipe = (date?: Date) => {
    const dateToUse = date || selectedDate || new Date();
    setSelectedDate(dateToUse);
    setSelectedRecipeId('');
    setSelectedMealType('dinner');
    setSearchQuery('');
    setShowAddRecipeModal(true);
    setIsDropdownOpen(false);
  };
  // Handle recipe deletion
  const handleDeleteRecipe = (recipe: any) => {
    setRecipeToDelete(recipe);
    setShowDeleteConfirmation(true);
  };
  // Confirm recipe deletion
  const confirmDeleteRecipe = async () => {
    if (recipeToDelete) {
      await deleteMealPlan(recipeToDelete.id);
      setShowDeleteConfirmation(false);
      setRecipeToDelete(null);

      // Also remove from local state
      setMealPlans(prev => prev.filter(mp => mp.id !== recipeToDelete.id));
    }
  };
  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe => {
    // For meal recipes
    if (recipe) {
      return recipe.meal_name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
  // Handle selecting a recipe from the dropdown
  const handleSelectRecipe = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsDropdownOpen(false);
    // Update recipe name in search field
    const selectedRecipe = recipes.find(r => r.id === recipeId);
    if (selectedRecipe) {
      if (selectedRecipe) {
        setSearchQuery(selectedRecipe.meal_name);
      }
    }
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  // Save selected recipe to calendar
  const handleSaveRecipe = async () => {
    if (!selectedRecipeId) return;
    // Find the selected recipe
    const recipe = recipes.find(r => r.id === selectedRecipeId);
    if (!recipe) return;
    // Format the date string
    const dateString = selectedDate ? formatDateString(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : new Date().toISOString().split('T')[0];
    // Create a recipe object for the cooking history
    let meal_name = '';
    if (recipe) {
      meal_name = recipe.meal_name;
    }
    const calendarRecipe = {
      id: `mealplan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      recipe_id: selectedRecipeId,
      meal_name: meal_name,
      meal_type: selectedMealType,
      serving_date: dateString,
    };
    const response = await addMealPlan(calendarRecipe);
    if (response && response.success) {
      const newMealPlan = { ...calendarRecipe, id: response.data.id, image: response.data.image_url };
      if (response.data.notEnoughItems && response.data.notEnoughItems.length > 0) {
        // Show notification
        setNotificationMessage('Recipe added! Required ingredients automatically added to your shopping list.');
        setShowNotification(true);
      } else {
        setNotificationMessage('Recipe added to calendar!');
        // No issues, add to state
        setMealPlans(prev => [...prev, newMealPlan]);
        // Reset and close modal
        resetAddModal();
      }
    }

    // Auto close NotificationMessage after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);

  };

  const resetAddModal = () => {
    setSelectedRecipeId('');
    setSearchQuery('');
    setShowAddRecipeModal(false);
  };

  // Week navigation functions
  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };
  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };
  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0);
    setCurrentWeekStart(startDate);
  };
  // Get week dates (7 consecutive days)
  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  // Get list view data for the current week
  const getWeekViewData = () => {
    const weekDates = getWeekDates();
    const weekData: Record<string, any> = {};
    // Initialize all 7 days of the week, even if they have no meals
    weekDates.forEach(date => {
      const dateString = formatDateObj(date);
      weekData[dateString] = [];
    });
    // Add cooking history data for the week
    mealPlans.forEach((item: any) => {
      if (weekData.hasOwnProperty(item.serving_date)) {
        weekData[item.serving_date].push(item);
      }
    });
    return weekData;
  };
  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // Check if date is today, yesterday, or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleMealClick = (item: MealPlan) => {
    const recipe = recipes.find(r => r.id === item.recipe_id);
    if (recipe) {
      setSelectedRecipeForDetail(recipe);
      setShowRecipeDetailModal(true);
    }
  };
  // Format week range for display
  const getWeekRangeDisplay = () => {
    const weekStart = new Date(currentWeekStart);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (date: Date) =>
      `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };
  // Toggle date group expansion
  const toggleDateGroupExpansion = (date: string) => {
    if (expandedDateGroups.includes(date)) {
      setExpandedDateGroups(expandedDateGroups.filter(d => d !== date));
    } else {
      setExpandedDateGroups([...expandedDateGroups, date]);
    }
  };
  // Toggle item actions menu
  const toggleItemActions = (itemId: string) => {
    if (showItemActions === itemId) {
      setShowItemActions(null);
    } else {
      setShowItemActions(itemId);
    }
  };
  // Initialize expanded groups
  useEffect(() => {
    // Initially expand today's group if it exists in current week
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(new Date());
    const weekData = getWeekViewData();
    if (weekData[today]) {
      setExpandedDateGroups([today]);
    } else if (Object.keys(weekData).length > 0) {
      // If today doesn't exist in current week, expand the first group
      setExpandedDateGroups([Object.keys(weekData)[0]]);
    }
  }, [currentWeekStart]);

  return <div className="flex flex-col w-full min-h-screen bg-linen">
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      {/* Page title */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="lg:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-sage/50 transition-colors" aria-label="Go back">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="page-title animate-fade-in">Cooking Calendar</h1>
        </div>
        <button onClick={() => handleOpenAddRecipe(new Date())} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-sage/50 transition-colors" aria-label="Add Recipe">
          <PlusIcon size={20} />
        </button>
      </div>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full px-6 lg:px-8 pb-4">
        {/* View Toggle */}
        <div className="bg-surface rounded-xl shadow-sm border border-line p-2 mb-2 mt-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex space-x-2">
              <button onClick={() => setViewMode('calendar')} className={`px-4 py-2 rounded-xl flex items-center text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-herb text-white shadow-sm' : 'bg-linen text-muted'}`}>
                <CalendarIcon size={18} className="mr-1.5" />
                Month
              </button>
              <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-xl flex items-center text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-herb text-white shadow-sm' : 'bg-linen text-muted'}`}>
                <ListIcon size={18} className="mr-1.5" />
                Week
              </button>
            </div>
          </div>
          {viewMode === 'calendar' && <>
            <div className="flex justify-between items-center">
              <button onClick={previousMonth} className="p-2 rounded-xl hover:bg-linen text-ink active:bg-sage/40 transition-colors" aria-label="Previous month">
                <ChevronLeftIcon size={20} />
              </button>
              <h2 className="text-base font-semibold text-ink">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-linen text-ink active:bg-sage/40 transition-colors" aria-label="Next month">
                <ChevronRightIcon size={20} />
              </button>
            </div>
            {/* Calendar Grid */}
            <div className="mt-4">
              {/* Day names */}
              <div className="grid grid-cols-7 mb-1">
                {dayNames.map(day => <div key={day} className="text-center text-xs font-medium text-muted py-1">
                  {day}
                </div>)}
              </div>
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                  const isSelected = selectedDate && day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();

                  // Get meal types for this day
                  const dateString = day ? formatDateString(currentYear, currentMonth, day) : '';
                  const dayMeals = day ? mealPlans.filter((item: MealPlan) => item.serving_date === dateString) : [];
                  const hasMealTypes = {
                    breakfast: dayMeals.some((meal: MealPlan) => meal.meal_type === 'breakfast'),
                    lunch: dayMeals.some((meal: MealPlan) => meal.meal_type === 'lunch'),
                    dinner: dayMeals.some((meal: MealPlan) => meal.meal_type === 'dinner'),
                    snack: dayMeals.some((meal: MealPlan) => meal.meal_type === 'snack')
                  };
                  return <div key={index} onClick={() => handleDayClick(day)} className={`
                          aspect-square lg:aspect-auto lg:min-h-[4.5rem] p-1.5 lg:p-2 relative flex flex-col justify-between
                          ${day ? 'cursor-pointer active:scale-95' : ''}
                          ${isSelected ? 'bg-sage/50 border-2 border-herb' : day ? 'bg-surface border border-line' : 'bg-transparent'}
                          ${isToday && !isSelected ? 'border-2 border-herb/50' : ''}
                          rounded-lg transition-all duration-150
                        `}>
                    {day && <>
                      <span className={`text-center text-sm lg:text-base ${isToday ? 'font-bold text-herb' : 'text-ink'} leading-none`}>
                        {day}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {hasMealTypes.breakfast && <div className="h-0.5 bg-sage/500 rounded-full"></div>}
                        {hasMealTypes.lunch && <div className="h-0.5 bg-sage/500 rounded-full"></div>}
                        {hasMealTypes.dinner && <div className="h-0.5 bg-herb rounded-full"></div>}
                        {hasMealTypes.snack && <div className="h-0.5 bg-sage/500 rounded-full"></div>}
                      </div>
                    </>}
                  </div>;
                })}
              </div>
            </div>
          </>}
          {/* List View */}
          {viewMode === 'list' && <div className="mt-2">
            {/* Week Navigation Controls */}
            <div className="flex justify-between items-center mb-3">
              <button onClick={goToPreviousWeek} className="flex items-center text-ink hover:text-ink px-2 py-1.5 rounded-lg hover:bg-linen active:bg-sage/40 text-sm">
                <ChevronLeftIcon size={16} className="mr-0.5" />
                Prev
              </button>
              <div className="flex items-center">
                <button onClick={goToCurrentWeek} className="px-3 py-1.5 text-xs rounded-lg bg-sage/50 text-herb border border-blue-100 hover:bg-sage active:bg-blue-200 font-medium">
                  Today
                </button>
                <span className="mx-2 text-sm font-medium text-ink">
                  {getWeekRangeDisplay()}
                </span>
              </div>
              <button onClick={goToNextWeek} className="flex items-center text-ink hover:text-ink px-2 py-1.5 rounded-lg hover:bg-linen active:bg-sage/40 text-sm">
                Next
                <ChevronRightIcon size={16} className="ml-0.5" />
              </button>
            </div>
            {/* Week View */}
            <div className="space-y-2">
              {Object.entries(getWeekViewData()).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).map(([date, items]) => {
                const isExpanded = expandedDateGroups.includes(date);
                const hasItems = Array.isArray(items) && items.length > 0;
                return <div key={date} className="border border-line rounded-xl overflow-hidden bg-surface">
                  <div className={`px-3 py-2.5 flex justify-between items-center cursor-pointer active:bg-sage/40 transition-colors ${hasItems ? 'bg-linen' : 'bg-surface'}`} onClick={() => toggleDateGroupExpansion(date)}>
                    <div className="flex items-center">
                      <CalendarIcon size={16} className="text-muted mr-2" />
                      <h3 className="font-medium text-sm text-ink">
                        {formatDisplayDate(date)}
                      </h3>
                      {hasItems && <span className="ml-2 bg-sage text-herb-deep text-xs px-2 py-0.5 rounded-full font-medium">
                        {items.length}
                      </span>}
                    </div>
                    {hasItems && (isExpanded ? <ChevronUpIcon size={18} className="text-muted" /> : <ChevronDownIcon size={18} className="text-muted" />)}
                  </div>
                  {isExpanded && hasItems && <div className="divide-y divide-line">
                    {items.map((item: MealPlan) => <div key={`${item.recipe_id}-${item.serving_date}-${item.meal_type}`} className="p-3 hover:bg-linen">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${getMealTypeIndicatorColor(item.meal_type)}`}></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-ink truncate">
                              {item.meal_name}
                            </p>
                            <p className="text-xs text-muted">
                              {getMealTypeLabel(item.meal_type)}
                            </p>
                          </div>
                        </div>
                        <div className="relative ml-2">
                          <button onClick={e => {
                            e.stopPropagation();
                            toggleItemActions(`${item.recipe_id}-${item.serving_date}-${item.meal_type}`);
                          }} className="p-2 rounded-full hover:bg-sage/50 active:bg-sage/60">
                            <MoreHorizontalIcon size={18} className="text-muted" />
                          </button>
                          {showItemActions === `${item.recipe_id}-${item.serving_date}-${item.meal_type}` && <div className="absolute right-0 mt-1 w-36 bg-surface rounded-lg shadow-lg border border-line z-10">
                            <button onClick={e => {
                              e.stopPropagation();
                              handleDeleteRecipe(item);
                              setShowItemActions(null);
                            }} className="w-full text-left px-3 py-2.5 text-sm text-herb hover:bg-sage/50 active:bg-sage flex items-center rounded-xl">
                              <TrashIcon size={14} className="mr-2" />
                              Remove
                            </button>
                          </div>}
                        </div>
                      </div>
                    </div>)}
                  </div>}
                  <div className="p-2 bg-linen flex justify-center border-t border-line">
                    <button onClick={e => {
                      e.stopPropagation();
                      const [year, month, day] = date.split('-').map(Number);
                      setSelectedDate(new Date(year, month - 1, day));
                      handleOpenAddRecipe(new Date(year, month - 1, day));
                    }} className="text-sm text-herb hover:text-herb-deep active:text-herb-deep flex items-center px-3 py-1.5 rounded-lg hover:bg-sage/50 active:bg-sage font-medium">
                      <PlusIcon size={14} className="mr-1" />
                      Add meal
                    </button>
                  </div>
                </div>;
              })}
            </div>
          </div>}
        </div>
        {/* Selected Date History - Only show in calendar view */}
        {viewMode === 'calendar' && selectedDate && <div className="bg-surface rounded-2xl shadow-sm border border-line p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold text-ink">
              {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <button onClick={() => handleOpenAddRecipe(selectedDate)} className="flex items-center text-sm bg-herb text-white px-3 py-1.5 rounded-xl hover:bg-herb active:bg-herb-deep transition-colors font-medium shadow-sm">
              <PlusIcon size={16} className="mr-1" />
              Add
            </button>
          </div>
          {getHistoryForSelectedDate().length > 0 ? <div>
            {Object.entries(getHistoryByMealType()).map(([type, meals]) => {
              if (meals.length === 0) return null;
              return <div key={type} className="mb-4 last:mb-0">
                <h4 className="text-sm font-medium text-ink mb-2">
                  {getMealTypeLabel(type)}:
                </h4>
                <div className="space-y-2">
                  {meals.map((item: MealPlan, index: number) => <div key={index} className={`p-4 rounded-xl border ${getMealTypeColor(type)} cursor-pointer hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1" onClick={() => handleMealClick(item)}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 ${type === 'breakfast' ? 'bg-sage/500' : type === 'lunch' ? 'bg-sage/500' : type === 'dinner' ? 'bg-herb' : 'bg-sage/500'}`}></div>
                        <p className="font-medium text-sm text-ink truncate">
                          {item.meal_name}
                        </p>
                        {item.image && <ImageIcon size={18} className="ml-2 text-muted flex-shrink-0" />}
                      </div>
                      <button onClick={() => handleDeleteRecipe(item)} className="p-1.5 rounded-full hover:bg-sage active:bg-sage text-herb transition-colors ml-2 flex-shrink-0" aria-label="Delete recipe">
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>)}
                </div>
              </div>;
            })}
          </div> : <div className="text-center py-6">
            <p className="text-muted">
              No meals recorded for this date.
            </p>
            <p className="text-muted text-sm mt-1">
              Cook something delicious today!
            </p>
          </div>}
        </div>}
      </main>
      {/* Add Recipe Modal */}
      {showAddRecipeModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        {/* Notification Toast */}
        {showNotification && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className="flex items-start gap-3 bg-surface border border-line rounded-xl shadow-lg p-4">

              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage/500 flex items-center justify-center">
                <CheckIcon size={16} className="text-white" />
              </div>

              {/* Message */}
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">
                  {notificationMessage}
                </p>
              </div>

              {/* Close */}
              <button
                onClick={() => {
                  setShowNotification(false);
                  setNotificationMessage('');
                }}
                className="text-muted hover:text-muted transition"
              >
                <XIcon size={16} />
              </button>
            </div>
          </div>
        )}
        <div className="bg-surface rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-line flex justify-between items-center sticky top-0 bg-surface z-10 rounded-t-2xl">
            <h3 className="font-semibold text-ink text-base">
              Add Recipe to Calendar
            </h3>
            <button onClick={() => setShowAddRecipeModal(false)} className="p-1.5 rounded-full hover:bg-sage/50 active:bg-sage/60">
              <XIcon size={20} className="text-muted" />
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="meal-date" className="block text-sm font-medium text-ink mb-1.5">
                  Date
                </label>
                <input type="text" id="meal-date" value={selectedDate ? selectedDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })} readOnly className="w-full p-3 bg-linen border border-line rounded-xl text-muted" />
              </div>
              <div>
                <label htmlFor="meal-type" className="block text-sm font-medium text-ink mb-1.5">
                  Meal Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => <button key={type} type="button" onClick={() => setSelectedMealType(type)} className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${selectedMealType === type ? 'bg-herb border-herb text-white shadow-sm' : 'bg-surface border-line text-ink hover:bg-linen active:bg-sage/40'}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>)}
                </div>
              </div>
              <div>
                <label htmlFor="recipe-search" className="block text-sm font-medium text-ink mb-1.5">
                  Select Recipe
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon size={16} className="text-muted" />
                    </div>
                    <input type="text" id="recipe-search" value={searchQuery} onChange={e => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      setSelectedRecipeId('');
                    }} onClick={() => setIsDropdownOpen(true)} placeholder="Search for a recipe..." className="w-full pl-10 pr-10 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-herb/30 focus:border-transparent" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <ChevronDownIcon size={16} className="text-muted cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
                    </div>
                  </div>
                  {isDropdownOpen && <div className="absolute z-10 mt-1 w-full bg-surface shadow-lg rounded-lg border border-line max-h-60 overflow-auto">
                    {filteredRecipes.length > 0 ? filteredRecipes.map(recipe => <div key={recipe.id} className="px-4 py-2 hover:bg-sage/50 cursor-pointer text-ink" onClick={() => handleSelectRecipe(recipe.id)}>
                      {recipe ? <div className="flex items-center">
                        <span>{recipe.meal_name}</span>
                      </div> : <div className="text-muted">Unknown Recipe</div>}
                    </div>) : <div className="px-4 py-3 text-muted text-center">
                      No recipes found
                    </div>}
                  </div>}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowAddRecipeModal(false)} className="w-1/2 bg-sage/40 text-ink py-2.5 rounded-xl font-medium text-sm hover:bg-sage/60 active:bg-sage transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveRecipe} disabled={!selectedRecipeId} className={`w-1/2 py-2.5 rounded-xl font-medium text-sm transition-colors ${selectedRecipeId ? 'bg-herb text-white hover:bg-herb active:bg-herb-deep shadow-sm' : 'bg-sage/60 text-muted cursor-not-allowed'}`}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-surface rounded-xl shadow-lg max-w-sm w-full">
          <div className="p-5">
            <div className="flex items-center text-herb mb-3">
              <AlertCircleIcon size={24} className="mr-2" />
              <h3 className="text-base font-semibold">Confirm Deletion</h3>
            </div>
            <p className="text-muted mb-5 text-sm">
              Are you sure you want to remove this recipe from your calendar?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteConfirmation(false)} className="px-4 py-2 bg-sage/40 hover:bg-sage/60 active:bg-sage text-ink rounded-xl transition-colors font-medium text-sm">
                Cancel
              </button>
              <button onClick={confirmDeleteRecipe} className="px-4 py-2 bg-herb hover:bg-herb active:bg-herb-deep text-white rounded-xl transition-colors font-medium text-sm shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>}
      {showRecipeDetailModal && selectedRecipeForDetail && <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
        <div className="bg-surface rounded-t-3xl sm:rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="sticky top-0 bg-surface border-b border-line z-10">
            <div className="p-5 flex justify-between items-start">
              <div className="flex-1 min-w-0 mr-4">
                <h2 className="text-2xl font-bold text-ink truncate">
                  {selectedRecipeForDetail.meal_name}
                </h2>
              </div>
              <button onClick={() => {
                setShowRecipeDetailModal(false);
                setSelectedRecipeForDetail(null);
              }} className="p-2 rounded-full hover:bg-sage/50 active:bg-sage/60 flex-shrink-0" aria-label="Close">
                <XIcon size={24} className="text-muted" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Recipe Image */}
            {selectedRecipeForDetail.image && <div className="w-full h-64 relative">
              <img src={selectedRecipeForDetail.image.url} alt={selectedRecipeForDetail.meal_name || 'Recipe'} className="w-full h-full object-cover" />
            </div>}

            <div className="p-6 space-y-6">
              {/* Ingredients Section */}
              <div>
                <h3 className="text-lg font-semibold text-ink mb-4 flex items-center">
                  <PackageIcon size={20} className="mr-2 text-herb" />
                  Ingredients
                </h3>
                <div className="bg-linen rounded-xl p-4 space-y-3">
                  {selectedRecipeForDetail.ingredients && selectedRecipeForDetail.ingredients.map((item: any, index: number) => <div key={index} className="flex justify-between items-center py-2 border-b border-line last:border-b-0">
                    <div className="flex items-center flex-1">
                      <div className="w-2 h-2 rounded-full bg-herb mr-3"></div>
                      <div>
                        <span className="font-medium text-ink capitalize">
                          {item.name}
                        </span>
                        <span className="text-sm text-muted ml-2">
                          {item.quantity && item.unit ? `(${item.quantity} ${item.unit})` : ''}
                        </span>
                      </div>
                    </div>
                    {item.price && item.quantity && <span className="font-medium text-ink">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>}
                  </div>)}
                </div>
              </div>

              {/* Additional Info */}
              {selectedRecipeForDetail && <div className="bg-sage/50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-herb-deep">
                  <span className="font-medium">Intruction: </span>{' '}
                  1. Preheat your oven to 350°F (175°C).{' '}
                  2. Mix all ingredients in a bowl until well combined.{' '}
                  {/* {getMealTypeLabel(selectedRecipeForDetail.mealInfo.type)} */}
                </p>
              </div>}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-surface border-t border-line p-4">
            <button onClick={() => {
              setShowRecipeDetailModal(false);
              setSelectedRecipeForDetail(null);
            }} className="w-full bg-sage/40 hover:bg-sage/60 active:bg-sage text-ink font-medium py-3 rounded-xl transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>}

    </div></div>;
}