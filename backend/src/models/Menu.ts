import mongoose, { Schema } from 'mongoose'
import { IMenu, IMenuCategory, IMenuItem } from '@/types'

const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    minlength: [1, 'Menu item name cannot be empty'],
    maxlength: [100, 'Menu item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Menu item description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Menu item price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true // Optional field
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v)
      },
      message: 'Image must be a valid URL ending with jpg, jpeg, png, or webp'
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  dietaryInfo: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher', 'low-carb', 'keto', 'paleo']
  }]
}, { _id: true })

const menuCategorySchema = new Schema<IMenuCategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [1, 'Category name cannot be empty'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  items: {
    type: [menuItemSchema],
    default: [],
    validate: {
      validator: function(items: IMenuItem[]) {
        return items.length <= 50 // Reasonable limit per category
      },
      message: 'Category cannot have more than 50 items'
    }
  }
}, { _id: false })

const menuSchema = new Schema<IMenu>({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required'],
    unique: true
  },
  categories: {
    type: [menuCategorySchema],
    default: [],
    validate: {
      validator: function(categories: IMenuCategory[]) {
        // Check for duplicate category names
        const categoryNames = categories.map(c => c.name.toLowerCase())
        const uniqueNames = new Set(categoryNames)
        return categoryNames.length === uniqueNames.size
      },
      message: 'Category names must be unique within a restaurant menu'
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
menuSchema.index({ restaurantId: 1 }, { unique: true })

// Pre-save middleware to update lastUpdated
menuSchema.pre('save', function(next) {
  this.lastUpdated = new Date()
  next()
})

// Pre-save middleware to validate items within categories
menuSchema.pre('save', function(next) {
  if (this.categories && this.categories.length > 0) {
    for (const category of this.categories) {
      if (category.items && category.items.length > 0) {
        // Check for duplicate item names within the same category
        const itemNames = category.items.map(item => item.name.toLowerCase())
        const uniqueNames = new Set(itemNames)
        if (itemNames.length !== uniqueNames.size) {
          next(new Error(`Duplicate item names found in category "${category.name}"`))
          return
        }
      }
    }
  }
  next()
})

// Static method to get menu by restaurant
menuSchema.statics.findByRestaurant = function(restaurantId: string) {
  return this.findOne({ restaurantId })
}

// Static method to get available items only
menuSchema.statics.getAvailableItems = function(restaurantId: string) {
  return this.findOne({ restaurantId })
    .then(menu => {
      if (!menu) return null

      const availableItems: any[] = []
      menu.categories.forEach(category => {
        category.items
          .filter(item => item.isAvailable)
          .forEach(item => {
            availableItems.push({
              ...item.toObject(),
              category: category.name
            })
          })
      })

      return availableItems
    })
}

// Instance method to get item by ID
menuSchema.methods.getItemById = function(itemId: string) {
  for (const category of this.categories) {
    const item = category.items.id(itemId)
    if (item) {
      return {
        ...item.toObject(),
        category: category.name
      }
    }
  }
  return null
}

// Instance method to add item to category
menuSchema.methods.addItem = function(categoryName: string, itemData: IMenuItem) {
  let category = this.categories.find(c => c.name === categoryName)

  if (!category) {
    // Create new category if it doesn't exist
    category = { name: categoryName, items: [] }
    this.categories.push(category)
  }

  category.items.push(itemData)
  return this.save()
}

// Instance method to remove item
menuSchema.methods.removeItem = function(itemId: string) {
  for (let i = 0; i < this.categories.length; i++) {
    const category = this.categories[i]
    const itemIndex = category.items.findIndex(item => item._id.toString() === itemId)

    if (itemIndex !== -1) {
      category.items.splice(itemIndex, 1)

      // Remove category if it's empty
      if (category.items.length === 0) {
        this.categories.splice(i, 1)
      }

      return this.save()
    }
  }

  throw new Error('Item not found')
}

// Instance method to update item
menuSchema.methods.updateItem = function(itemId: string, updateData: Partial<IMenuItem>) {
  for (const category of this.categories) {
    const item = category.items.id(itemId)
    if (item) {
      Object.assign(item, updateData)
      return this.save()
    }
  }

  throw new Error('Item not found')
}

export const Menu = mongoose.model<IMenu>('Menu', menuSchema)
export default Menu