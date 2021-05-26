```java
/**
 * @description: 215.数组中的第K个最大元素
 * @author: minalz
 * @date: 2021-05-26 23:50
 **/
public class MaxHeap {

    /**
     * 第一种方式 堆的数据结构
     * @param nums
     * @param k
     * @return
     */
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(k, new Comparator<Integer>(){
            public int compare(Integer num1, Integer num2) {
                return num2 - num1; // num2 - num1 最大堆
            }
        });

        for (int i: nums) {
            maxHeap.add(i);
        }

        for (int i = 0; i < k - 1; i++) {
            maxHeap.poll();
        }

        return maxHeap.poll();
    }

    /**
     * 快速排序方式
     * @param nums
     * @param k
     * @return
     */
    public int findKthLargest1(int[] nums, int k) {
        if (nums == null || nums.length == 0 || k < 1 || k > nums.length) {
            return -1;
        }
        return partition(nums, 0, nums.length - 1, nums.length - k);
    }

    public int partition(int[] nums, int start, int end, int k) {
        if (start >= end) {
            return nums[k];
        }

        int left = start;
        int right = end;
        int pivot = nums[(start + end)/2];
        while (left <= right) {
            while (left <= right && nums[left] < pivot) {
                left++;
            }
            while (left <= right && nums[right] > pivot) {
                right--;
            }
            if (left <= right) {
                int temp = nums[left];
                nums[left] = nums[right];
                nums[right] = temp;
                left++;
                right--;
            }
        }
        if (k <= right) {
            return partition(nums, start, right, k);
        }
        if (k >= left) {
            return partition(nums, left, end, k);
        }
        return nums[k];
    }

    @Test
    public void test01() {
        int[] nums = {3,2,1,5,6,4};
        int k = 2;
        System.out.println(findKthLargest1(nums, 2));
    }
}

```