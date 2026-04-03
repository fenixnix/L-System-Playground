# L-System (Lindenmayer System) 技术文档

## 1. 概述

L系统（Lindenmayer System）是一种形式文法，由匈牙利生物学家 Aristid Lindenmayer 于1968年提出。
最初用于模拟植物生长过程，现已广泛应用于计算机图形学、分形艺术和自然现象建模。

### 核心思想
通过**字符串重写规则**（String Rewriting）递归生成复杂结构，再将字符串解释为**图形绘制指令**。

---

## 2. 数学定义

一个 L系统是一个三元组 G = (V, ω, P)：

| 符号 | 名称 | 说明 |
|------|------|------|
| **V** | 字母表 (Alphabet) | 包含所有可用符号的集合 |
| **ω** | 公理/初始状态 (Axiom) | 初始字符串 |
| **P** | 产生式规则集 (Productions) | 符号 → 替换字符串的映射规则 |

### 扩展定义（参数化L系统）
G = (V, Σ, ω, P)，其中：
- **Σ**: 形式参数集合
- 规则形式: `A(t1,...,tn) : condition → succ`

---

## 3. 符号体系

### 3.1 基础绘图符号

| 符号 | 2D含义 | 3D含义 |
|------|--------|--------|
| `F` | 向前画线（步长d） | 向前画线（步长d） |
| `f` | 向前移动不画线 | 向前移动不画线 |
| `+` | 左转角度 δ | 绕Up轴左转角度δ（Yaw） |
| `-` | 右转角度 δ | 绕Up轴右转角度δ（Yaw） |
| `&` | - | 绕Right轴向下转角度δ（Pitch） |
| `^` | - | 绕Right轴向上转角度δ（Pitch） |
| `\` | - | 绕Forward轴左滚角度δ（Roll） |
| `/` | - | 绕Forward轴右滚角度δ（Roll） |
| `\|` | 转向180° | 绕Up轴转向180° |
| `[` | 压栈（保存状态） | 压栈（保存状态） |
| `]` | 弹栈（恢复状态） | 弹栈（恢复状态） |

### 3.2 状态定义

**2D状态** = (x, y, angle)
**3D状态** = (position, heading, up, left) — 使用方向向量表示

---

## 4. 经典L系统示例

### 4.1 Koch曲线
```
名称: Koch Curve
变量: F
公理: F
规则: F → F+F-F-F+F
角度: 90°
迭代: 4次
```

### 4.2 Sierpinski三角形
```
名称: Sierpinski Triangle
变量: F, G
公理: F-G-G
规则:
  F → F-G+F+G-F
  G → GG
角度: 120°
迭代: 6次
```

### 4.3 龙形曲线 (Dragon Curve)
```
名称: Dragon Curve
变量: F, G
公理: FX
规则:
  X → X+YF+
  Y → -FX-Y
角度: 90°
迭代: 12次
```

### 4.4 植物分形 (Fractal Plant)
```
名称: Fractal Plant / Barnsley Fern
变量: F, X
公理: X
规则:
  X → F+[[X]-X]-F[-FX]+X
  F → FF
角度: 25°
迭代: 5次
```

### 4.5 3D Hilbert曲线
```
名称: 3D Hilbert Curve
变量: A, B, C, D, E, F, G, H
公理: A
规则:
  A → B-F+CFC+F-D&F^D-F+&&CFC+F+B>>
  B → A>F<CFC<F-D^F^D-F->^^CFC<F+A
  C → B>F+CFC<F-D&FD-F-^^CFC<F+B>>
  D → B>F+CFC<F-D^F^D-F->^^CFC<F+A
  E → CFB+F+DF&F&D--B-F-B++CFC+F+D>>
  F → EFB+F+DF^F^D--B-F-B^^CFC+F+D
  G → CFB+F+DF&F&D--B-F-B++CFC+F+D>>
  H → EFB+F+DF^F^D--B-F-B^^CFC+F+D
```

### 4.6 3D树 (3D Tree)
```
名称: 3D Fractal Tree
变量: F
公理: F
规则: F → F[&F]F[/F]F[^F]F
角度: 20°
迭代: 4次
```

---

## 5. 算法流程

### 5.1 字符串生成算法（重写阶段）

```
function generate(axiom, rules, iterations):
    current = axiom
    for i from 1 to iterations:
        next_string = ""
        for each char c in current:
            if c in rules:
                next_string += rules[c]
            else:
                next_string += c
        current = next_string
    return current
```

**时间复杂度**: O(n * m * k)
- n: 迭代次数
- m: 每代平均字符串长度
- k: 平均替换长度

**空间优化**:
- 对于确定性L系统，第n代的长度可预计算
- 可使用增量生成策略

### 5.2 图形解释算法（渲染阶段）

#### 2D海龟图形解释器
```
function interpret2D(string, angle, step):
    stack = []
    state = { x: 0, y: 0, angle: 0 }
    
    for each char c in string:
        switch(c):
            case 'F':
                new_x = state.x + step * cos(state.angle)
                new_y = state.y + step * sin(state.angle)
                draw_line(state.x, state.y, new_x, new_y)
                state.x = new_x; state.y = new_y
            case 'f':
                new_x = state.x + step * cos(state.angle)
                new_y = state.y + step * sin(state.angle)
                state.x = new_x; state.y = new_y
            case '+': state.angle += angle
            case '-': state.angle -= angle
            case '[': push(stack, state)
            case ']': state = pop(stack)
```

#### 3D海龟图形解释器
```
function interpret3D(string, angles, step):
    stack = []
    turtle = {
        position: [0, 0, 0],
        heading: [1, 0, 0],   // 前方向量
        up:      [0, 1, 0],   // 上方向量
        left:    [0, 0, 1]    // 左方向量
    }
    
    for each char c in string:
        switch(c):
            case 'F':
                new_pos = turtle.position + step * turtle.heading
                draw_line(turtle.position, new_pos)
                turtle.position = new_pos
            case '+': rotate_around(up, angles.yaw)
            case '-': rotate_around(up, -angles.yaw)
            case '&': rotate_around(left, angles.pitch)
            case '^': rotate_around(left, -angles.pitch)
            case '/': rotate_around(heading, angles.roll)
            case '\\': rotate_around(heading, -angles.roll)
            case '[': push(stack, deepcopy(turtle))
            case ']': turtle = pop(stack)
```

---

## 6. 参数化L系统

### 6.1 定义
参数化L系统中，符号可以携带数值参数：
- `A(t)` 表示符号A携带参数t
- 规则可包含条件判断：`A(t) : t > 1 → B(t-1)A(t/2)`

### 6.2 示例：变长线段植物
```
变量: F, A
公理: A(10)
规则:
  A(l) : l > 1 → F(l)[+(45)A(l*0.7)][-(45)A(l*0.7)]
  F(l) → 画长度为l的线段
```

---

## 7. 随机L系统 (Stochastic L-System)

### 7.1 定义
每个符号可映射到多条规则，每条规则有概率权重：

```
F → (0.5) F[+F]F[-F]F
F → (0.33) F[+F]F[-F][F]
F → (0.17) FF
```

### 7.2 应用
- 更自然的植物形态生成
- 有机结构的随机变化

---

## 8. 上下文相关L系统

### 8.1 定义
规则的匹配取决于上下文（前后字符）：

```
A < B > C → D   // B在A之后、C之前时替换为D
A < B → D       // 仅检查左侧上下文
B > C → D       // 仅检查右侧上下文
```

### 8.2 应用
- 细胞间信息传递建模
- 复杂生物过程模拟

---

## 9. 性能考量

### 9.1 字符串爆炸问题
- 迭代n次后，字符串长度 ≈ O(k^n)，k为平均展开因子
- Koch曲线: 每次迭代长度×5
- Sierpinski: 每次迭代长度≈×3

### 9.2 优化策略
1. **懒加载渲染**: 边解析边绘制，不存储完整字符串
2. **并行计算**: GPU加速字符串生成
3. **LOD (Level of Detail)**: 根据缩放级别调整迭代次数
4. **裁剪**: 只渲染视口内的部分
5. **实例化渲染**: 对重复分支使用GPU instancing

---

## 10. 应用领域

| 领域 | 应用 |
|------|------|
| 计算机图形学 | 程序化内容生成、地形生成 |
| 游戏开发 | 植物/树木生成、城市布局 |
| 建筑设计 | 分形建筑结构 |
| 艺术 | 生成艺术、算法艺术 |
| 生物学 | 有机形态模拟 |
| 音乐 | 算法作曲 |

---

## 11. 参考资料

1. Prusinkiewicz, P., & Lindenmayer, A. (1990). *The Algorithmic Beauty of Plants*
2. Prusinkiewicz, P., et al. (2001). *Visual Models of Morphogenesis*
3. Lindenmayer, A. (1968). Mathematical models for cellular interactions in development
