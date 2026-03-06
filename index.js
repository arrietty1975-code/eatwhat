Page({
    data: {
      // 日期和状态
      currentDate: '2026年02月28日',
      
      // 三餐随机相关
      breakfastRolling: false,
      breakfastFood: '全麦三明治', // 默认菜品
      breakfastFoodList: ['全麦三明治', '香菇青菜粥', '豆浆油条', '鸡蛋灌饼', '牛奶燕麦'],
      breakfastInterval: null,
      
      lunchRolling: false,
      lunchFood: '鸡胸肉沙拉', // 默认菜品
      lunchFoodList: ['鸡胸肉沙拉', '牛肉汉堡', '番茄炒蛋盖饭', '菌菇汤面', '青椒肉丝'],
      lunchInterval: null,
      
      dinnerRolling: false,
      dinnerFood: '番茄肥牛火锅', // 默认菜品
      dinnerFoodList: ['番茄肥牛火锅', '芒果班戟', '清蒸鲈鱼', '烤肉', '螺蛳粉'],
      dinnerInterval: null,
  
      // 基础配置
      mealTypes: ['早餐', '午餐', '晚餐'],
      selectedMealType: '',
      tags: ['轻食', '火锅', '快餐', '家常菜', '甜品', '面食', '米饭', '小吃'],
      selectedTags: [],
      
      // 食物列表
      foods: [
        { id: 1, name: '全麦三明治', lastEatDate: '2026-02-25', mealType: '早餐', tags: ['轻食'] },
        { id: 2, name: '番茄肥牛火锅', lastEatDate: '2026-02-27', mealType: '晚餐', tags: ['火锅'] },
        { id: 3, name: '鸡胸肉沙拉', lastEatDate: '2026-02-26', mealType: '午餐', tags: ['轻食'] },
        { id: 4, name: '牛肉汉堡', lastEatDate: '2026-02-24', mealType: '午餐', tags: ['快餐'] },
        { id: 5, name: '芒果班戟', lastEatDate: '2026-02-23', mealType: '晚餐', tags: ['甜品'] },
        { id: 6, name: '香菇青菜粥', lastEatDate: '2026-02-28', mealType: '早餐', tags: ['家常菜'] }
      ],
      filteredFoods: [],
      
      // 弹窗相关
      showModal: false,
      isEditMode: false, // 新增：是否为编辑模式
      editFoodId: '',    // 新增：当前编辑的食物ID
      inputFoodName: '',
      checkedTags: [],
      recommendFoods: ['照烧鸡腿饭', '菌菇汤面', '紫薯芋泥甜品', '香煎三文鱼'],
      
      // 删除确认弹窗
      showDeleteModal: false, // 新增：删除确认弹窗
      deleteFoodId: '',       // 新增：待删除的食物ID
      
      // 随机时长配置
      rollDuration: 2000
    },
  
    // 页面加载
    onLoad() {
      this.setData({ filteredFoods: this.data.foods });
    },
  
    // ========== 三餐随机控制（自动停止） ==========
    // 早餐随机
    toggleBreakfastRoll() {
      if (this.data.breakfastRolling) return;
      this.setData({ breakfastRolling: true });
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.data.breakfastFoodList.length);
        this.setData({ breakfastFood: this.data.breakfastFoodList[randomIndex] });
      }, 100);
      this.setData({ breakfastInterval: interval });
      
      setTimeout(() => {
        clearInterval(interval);
        this.setData({ breakfastRolling: false });
      }, this.data.rollDuration);
    },
  
    // 午餐随机
    toggleLunchRoll() {
      if (this.data.lunchRolling) return;
      this.setData({ lunchRolling: true });
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.data.lunchFoodList.length);
        this.setData({ lunchFood: this.data.lunchFoodList[randomIndex] });
      }, 100);
      this.setData({ lunchInterval: interval });
      
      setTimeout(() => {
        clearInterval(interval);
        this.setData({ lunchRolling: false });
      }, this.data.rollDuration);
    },
  
    // 晚餐随机
    toggleDinnerRoll() {
      if (this.data.dinnerRolling) return;
      this.setData({ dinnerRolling: true });
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.data.dinnerFoodList.length);
        this.setData({ dinnerFood: this.data.dinnerFoodList[randomIndex] });
      }, 100);
      this.setData({ dinnerInterval: interval });
      
      setTimeout(() => {
        clearInterval(interval);
        this.setData({ dinnerRolling: false });
      }, this.data.rollDuration);
    },
  
    // 一键选择三餐
    oneKeyChooseAll() {
      this.toggleBreakfastRoll();
      setTimeout(() => this.toggleLunchRoll(), 200);
      setTimeout(() => this.toggleDinnerRoll(), 400);
      
      wx.showToast({
        title: '正在为你选择三餐',
        icon: 'none',
        duration: 1500
      });
    },
  
    // 清空所有筛选标签
    clearAllTags() {
      this.setData({
        selectedTags: [],
        filteredFoods: this.data.foods
      });
      
      wx.showToast({
        title: '筛选已清空',
        icon: 'success',
        duration: 1000
      });
    },
  
    // 标签筛选切换
    toggleTag(e) {
      const tag = e.currentTarget.dataset.tag;
      const selectedTags = [...this.data.selectedTags];
      const index = selectedTags.indexOf(tag);
      
      if (index > -1) {
        selectedTags.splice(index, 1);
      } else {
        selectedTags.push(tag);
      }
      
      this.setData({ selectedTags });
      this.filterFoods(selectedTags);
    },
  
    // 筛选食物列表
    filterFoods(tags) {
      if (tags.length === 0) {
        this.setData({ filteredFoods: this.data.foods });
        return;
      }
      
      const filtered = this.data.foods.filter(food => {
        return tags.some(tag => food.tags.includes(tag));
      });
      
      this.setData({ filteredFoods: filtered });
    },
  
    // 选择三餐分类
    chooseMealType(e) {
      this.setData({ selectedMealType: e.detail.value });
    },
  
    // ========== 新增/修改食物功能 ==========
    // 显示添加弹窗
    showAddModal() {
      this.setData({
        showModal: true,
        isEditMode: false, // 新增模式
        inputFoodName: '',
        checkedTags: [],
        selectedMealType: ''
      });
    },
  
    // 显示编辑弹窗（新增）
    showEditModal(e) {
      const food = e.currentTarget.dataset.food;
      this.setData({
        showModal: true,
        isEditMode: true, // 编辑模式
        editFoodId: food.id,
        inputFoodName: food.name,
        checkedTags: food.tags,
        selectedMealType: food.mealType
      });
    },
  
    // 隐藏弹窗（统一）
    hideModal() {
      this.setData({
        showModal: false,
        isEditMode: false,
        editFoodId: '',
        inputFoodName: '',
        checkedTags: [],
        selectedMealType: ''
      });
    },
  
    // 输入食物名称
    inputFoodName(e) {
      this.setData({ inputFoodName: e.detail.value });
    },
  
    // 选择标签
    checkTag(e) {
      this.setData({ checkedTags: e.detail.value });
    },
  
    // 选择智能推荐
    chooseRecommend(e) {
      this.setData({ inputFoodName: e.currentTarget.dataset.name });
    },
  
    // 添加新食物
    addFood() {
      // 验证必填项
      if (!this.data.inputFoodName) {
        wx.showToast({ title: '请输入食物名称', icon: 'none' });
        return;
      }
      if (!this.data.selectedMealType) {
        wx.showToast({ title: '请选择三餐分类', icon: 'none' });
        return;
      }
      
      // 构建新食物对象
      const newFood = {
        id: this.data.foods.length + 1,
        name: this.data.inputFoodName,
        lastEatDate: '2026-02-28',
        mealType: this.data.selectedMealType,
        tags: this.data.checkedTags
      };
      
      // 更新食物列表
      const foods = [...this.data.foods, newFood];
      this.setData({
        foods,
        filteredFoods: foods,
        showModal: false
      });
  
      // 将新食物添加到对应三餐的随机列表
      this.updateRandomFoodList(newFood.mealType, newFood.name, 'add');
      
      wx.showToast({ title: '添加成功', icon: 'success' });
    },
  
    // 修改食物（新增核心方法）
    updateFood() {
      // 验证必填项
      if (!this.data.inputFoodName) {
        wx.showToast({ title: '请输入食物名称', icon: 'none' });
        return;
      }
      if (!this.data.selectedMealType) {
        wx.showToast({ title: '请选择三餐分类', icon: 'none' });
        return;
      }
      
      // 找到原食物信息
      const foods = [...this.data.foods];
      const index = foods.findIndex(item => item.id === this.data.editFoodId);
      if (index === -1) {
        wx.showToast({ title: '食物不存在', icon: 'none' });
        return;
      }
      
      // 保存原分类（用于更新随机列表）
      const oldMealType = foods[index].mealType;
      const oldName = foods[index].name;
      
      // 更新食物信息
      foods[index] = {
        ...foods[index],
        name: this.data.inputFoodName,
        mealType: this.data.selectedMealType,
        tags: this.data.checkedTags
      };
      
      this.setData({
        foods,
        filteredFoods: foods,
        showModal: false
      });
  
      // 更新随机列表：先删除旧的，再添加新的
      if (oldMealType !== this.data.selectedMealType) {
        this.updateRandomFoodList(oldMealType, oldName, 'remove');
        this.updateRandomFoodList(this.data.selectedMealType, this.data.inputFoodName, 'add');
      } else {
        // 分类未变，仅修改名称
        this.updateRandomFoodList(oldMealType, oldName, 'update', this.data.inputFoodName);
      }
      
      wx.showToast({ title: '修改成功', icon: 'success' });
    },
  
    // ========== 删除食物功能（新增） ==========
    // 显示删除确认弹窗
    showDeleteConfirm(e) {
      this.setData({
        showDeleteModal: true,
        deleteFoodId: e.currentTarget.dataset.id
      });
    },
  
    // 隐藏删除确认弹窗
    hideDeleteConfirm() {
      this.setData({
        showDeleteModal: false,
        deleteFoodId: ''
      });
    },
  
    // 确认删除
    confirmDelete() {
      const foods = [...this.data.foods];
      const index = foods.findIndex(item => item.id === this.data.deleteFoodId);
      if (index === -1) {
        wx.showToast({ title: '食物不存在', icon: 'none' });
        this.hideDeleteConfirm();
        return;
      }
      
      // 保存要删除的食物信息（用于更新随机列表）
      const deletedFood = foods[index];
      
      // 删除食物
      foods.splice(index, 1);
      this.setData({
        foods,
        filteredFoods: foods,
        showDeleteModal: false
      });
  
      // 从随机列表中删除
      this.updateRandomFoodList(deletedFood.mealType, deletedFood.name, 'remove');
      
      wx.showToast({ title: '删除成功', icon: 'success' });
    },
  
    // ========== 工具方法：更新随机食物列表 ==========
    updateRandomFoodList(mealType, foodName, action, newName = '') {
      let listKey = '';
      switch (mealType) {
        case '早餐':
          listKey = 'breakfastFoodList';
          break;
        case '午餐':
          listKey = 'lunchFoodList';
          break;
        case '晚餐':
          listKey = 'dinnerFoodList';
          break;
        default:
          return;
      }
      
      const list = [...this.data[listKey]];
      const index = list.indexOf(foodName);
      
      if (action === 'add' && index === -1) {
        list.push(foodName);
      } else if (action === 'remove' && index !== -1) {
        list.splice(index, 1);
      } else if (action === 'update' && index !== -1) {
        list[index] = newName;
      }
      
      this.setData({ [listKey]: list });
    },
  
    // 页面卸载清除定时器
    onUnload() {
      [this.data.breakfastInterval, this.data.lunchInterval, this.data.dinnerInterval].forEach(interval => {
        if (interval) clearInterval(interval);
      });
    }
  });