# 树

## 概念

树是一种分层数据的抽象模型。现实生活中最常见的树的例子是家谱，或是公司的组织架构图

位于树顶部的节点叫做根节点，它没有父节点。节点分为内部节点和外部节点，至少有一个子节点的节点成为内部节点，一个子节点也没有的成为外部节点也叫做叶节点。

一个节点可以有祖先和后代，一个节点(除了根节点)的祖先包括父节点、祖父节点、曾祖 父节点等。一个节点的后代包括子节点、孙子节点、曾孙节点等。

节点的一个属性是深度，节点的深度取决于它的祖先节点的数量。树的高度取决于所有节点深度的最大值。

## 二叉树和二叉搜索树

二叉树中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。这些定义有助于我们写出更高效的向/从树中插入、查找和删除节点的算法。二叉树在计算机科学中的 应用非常广泛。

二叉搜索树(BST)是二叉树的一种，但是它只允许你在左侧节点存储(比父节点)小的值， 在右侧节点存储(比父节点)大(或者等于)的值。

如下实现就是生成一个二叉搜索树类，该树的每个节点可以抽象出一个类，node 节点上都有 search、visit、addNode、removeNode 方法。生成一个二叉搜索树其实就是从添加一个 root 节点开始的，添加子节点就是一直调用节点的 addNode 方法。所以对于树的操作其实最后都简化成了对于节点的操作

```js
// 二叉搜索树
// https://github.com/Nealyang/YOU-SHOULD-KNOW-JS/blob/master/doc/dataStructure/tree.md
/* Binary Search Tree!!
 *
 * Nodes that will go on the Binary Tree.
 * They consist of the data in them, the node to the left, the node
 * to the right, and the parent from which they came from.
 *
 * A binary tree is a data structure in which an element
 * has two successors(children). The left child is usually
 * smaller than the parent, and the right child is usually
 * bigger.
 */

// class Node
const Node = (function Node() {
    // Node in the tree
    function Node(val) {
        this.value = val;
        this.left = null;
        this.right = null;
    }

    // Search the tree for a value
    Node.prototype.search = function (val) {
        if (this.value === val) {
            return this;
        } else if (val < this.value && this.left !== null) {
            return this.left.search(val);
        } else if (val > this.value && this.right !== null) {
            return this.right.search(val);
        }
        return null;
    };

    // Visit a node
    Node.prototype.visit = function (output = (value) => console.log(value)) {
        // Recursively go left
        if (this.left !== null) {
            this.left.visit();
        }
        // Print out value
        output(this.value);
        // Recursively go right
        if (this.right !== null) {
            this.right.visit();
        }
    };

    // Add a node
    Node.prototype.addNode = function (n) {
        if (n.value < this.value) {
            if (this.left === null) {
                this.left = n;
            } else {
                this.left.addNode(n);
            }
        } else if (n.value > this.value) {
            if (this.right === null) {
                this.right = n;
            } else {
                this.right.addNode(n);
            }
        }
    };

    // remove a node
    Node.prototype.removeNode = function (val) {
        if (val === this.value) {
            if (!this.left && !this.right) {
                return null;
            } else {
                if (this.left) {
                    const leftMax = maxVal(this.left);
                    this.value = leftMax;
                    this.left = this.left.removeNode(leftMax);
                } else {
                    const rightMin = minVal(this.right);
                    this.value = rightMin;
                    this.right = this.right.removeNode(rightMin);
                }
            }
        } else if (val < this.value) {
            this.left = this.left && this.left.removeNode(val);
        } else if (val > this.value) {
            this.right = this.right && this.right.removeNode(val);
        }
        return this;
    };

    // find maximum value in the tree
    const maxVal = function (node) {
        if (!node.right) {
            return node.value;
        }
        return maxVal(node.right);
    };

    // find minimum value in the tree
    const minVal = function (node) {
        if (!node.left) {
            return node.value;
        }
        return minVal(node.left);
    };
    // returns the constructor
    return Node;
})();

// class Tree
const Tree = (function () {
    function Tree() {
        // Just store the root
        this.root = null;
    }

    // Inorder traversal
    Tree.prototype.traverse = function () {
        if (!this.root) {
            // No nodes are there in the tree till now
            return;
        }
        this.root.visit();
    };

    // Start by searching the root
    Tree.prototype.search = function (val) {
        const found = this.root.search(val);
        if (found !== null) {
            return found.value;
        }
        // not found
        return null;
    };

    // Add a new value to the tree
    Tree.prototype.addValue = function (val) {
        const n = new Node(val);
        if (this.root === null) {
            this.root = n;
        } else {
            this.root.addNode(n);
        }
    };

    // remove a value from the tree
    Tree.prototype.removeValue = function (val) {
        // remove something if root exists
        this.root = this.root && this.root.removeNode(val);
    };

    // returns the constructor
    return Tree;
})();

export { Tree };
```
