import xmltodict
import json
import re

def xml_to_json(input_xml, output_json):
    """
    Convert a large XML file to JSON using xmltodict and process it in chunks.
    """
    print('start')
    with open(input_xml, 'rb') as xml_file, open(output_json, 'w') as json_file:
        # Initialize a JSON list (to represent an array of objects)
        print('with')
        json_file.write('[')

        # Initialize a variable to keep track of whether we need to add a comma separator
        first_object = True
        is_in_list = False

        # Initialize a buffer to store XML data in chunks
        xml_chunk = ""

        for line in xml_file:
            line = line.decode('utf-8')

            if line.strip() == '<page>':  # Replace with the actual root element name
                is_in_list = True
            
            if is_in_list:
                xml_chunk += line

            # Check if we've reached the end of an XML object
            if line.strip() == '</page>':  # Replace with the actual root element name
                # Parse the XML chunk into a dictionary
                xml_dict = xmltodict.parse(xml_chunk)
                print(xml_dict['page']['title'])

                value = ""
                try:
                 value = xml_dict['page']['revision']['text']['#text']
                except KeyError:
                 value = ""

                # pattern = r'\[\[([^]]+)\]\]'
                pattern = r'\[\[([^|\]]+)(?:\|[^]]+)?\]\]'
                matches = re.findall(pattern, value)

                # Convert the dictionary to JSON
                json_data = json.dumps({"title": xml_dict['page']['title'], "linksTo": matches}, indent=2)

                # Write the JSON data to the output file, adding a comma separator if necessary
                if not first_object:
                    json_file.write(',')
                json_file.write(json_data)
                json_file.flush()

                # Reset the buffer and set the first_object flag to False
                xml_chunk = ""
                first_object = False

        # Close the JSON array
        json_file.write(']')

if __name__ == "__main__":
    input_xml_path = '/Volumes/The Other One/enwiki-20230820-pages-articles-multistream.xml'  # Replace with the path to your 96GB XML file
    output_json_path = 'output.json'    # Replace with the desired JSON output file path

    xml_to_json(input_xml_path, output_json_path)