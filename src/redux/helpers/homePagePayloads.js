export const updateTreesOptimistically = (trees, treeId, treeName) => {
    return trees.reduce((res, ele) => {
        console.log(ele.treeId)
        res.push({
            ...ele,
            treeName: (ele.treeId === treeId) ? treeName : ele.treeName
        })
        return res;
    },[])
}