import json
import sys

json_origin = json.load(open(sys.argv[1], 'r'))
json_target = json.load(open(sys.argv[2], 'r'))


#original file  parsing
ori_array = {}
ori_compared_data = {}

for origin in json_origin['targets']:
   ori_name = origin['name']
   ori_data = origin['blocks']

   ori_keys = [key for key in ori_data]
   ori_name_blocks_dic = {ori_name : ori_keys}
   ori_compared_data[ori_name] = {}

   oriCnt = len(ori_keys)
   for value in ori_keys:
      value_key = [key for key in ori_data[value]]
      if "x" not in value_key or "y" not in value_key:
         ori_data[value]['x'] = "None"
         ori_data[value]['y'] = "None"

      ori_saved_data = {}
      ori_saved_data[value] = {"x" : ori_data[value]["x"], "y" : ori_data[value]["y"], "parent" : ori_data[value]["parent"], "input" : ori_data[value]["inputs"]}
      ori_compared_data[ori_name].update(ori_saved_data)

      if "menu" in ori_data[value]["opcode"]:
         oriCnt -= 1

   ori_array[ori_name] = oriCnt


#target file parsing
tar_array={}
tar_compared_data={}

for target in json_target['targets']:
   tar_name = target['name']
   tar_data = target['blocks']

#   print("Sprite name : " + tar_name)

   tar_keys = [key for key in tar_data]
   tar_name_blocks_dic = {tar_name : tar_keys}
   tar_compared_data[tar_name] = {}

   tarCnt = len(tar_keys)
   for value in tar_keys:
      value_key = [key for key in tar_data[value]]
      if "x" not in value_key or "y" not in value_key:
         tar_data[value]['x'] = "None"
         tar_data[value]['y'] = "None"

      tar_saved_data = {}
      tar_saved_data[value] = {"x" : tar_data[value]["x"], "y" : tar_data[value]["y"], "parent" : tar_data[value]["parent"], "input" : tar_data[value]["inputs"]}
      tar_compared_data[tar_name].update(tar_saved_data)

      if "menu" in tar_data[value]["opcode"]:
         tarCnt -= 1

   tar_array[tar_name] = tarCnt

#compare
if len(ori_array) != len(tar_array):
   print("other_changed")

else:
   names = [key for key in ori_array]

   for name in names:
      cnt = 0
      block_changed = False

   # 코드 추가
      if ori_array[name] < tar_array[name] :
         if tar_array[name] - ori_array[name] == 1 :
            block_changed = True
            print("block_added")
         else:
            block_changed = True
            print("block_copied")

   # 코드 삭제
      elif ori_array[name] > tar_array[name] :
         block_changed = true
         print("block_removed")

   # 코드 변경
      else :
         compared_keys = [key for key in ori_compared_data[name]]
         for compared_key in compared_keys:
            if ori_compared_data[name][compared_key]["parent"] != tar_compared_data[name][compared_key]["parent"]:
               block_changed = True
               print("block_order_changed")
               break
            elif (ori_compared_data[name][compared_key]["x"] != tar_compared_data[name][compared_key]["x"]) or (ori_compared_data[name][compared_key]["y"] != tar_compared_data[name][compared_key]["y"]):
               block_changed = True
               print("block_position_changed")
               break
            elif ori_compared_data[name][compared_key]["input"] != tar_compared_data[name][compared_key]["input"]:
               block_changed = True
               print("block_input_changed")
               break

      if not block_changed:
         print("block_not_changed")

      cnt += 1
