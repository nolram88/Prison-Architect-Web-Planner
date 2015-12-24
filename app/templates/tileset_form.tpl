<table>
	<tr>
		<td>Image</td>
		<td>
			<div id="file_container">
				<input type="file" name="file_tileset">
				<!-- <input type="button" name="file_overlay" value="choose tileset" class="stretch"></div> -->
			</div>
		</td>
	</tr>
	<tr>
		<td>Metadata</td>
		<td>
			<div id="file_container">
				<input type="file" name="metadata_tileset">
				<!-- <input type="button" name="file_overlay" value="choose tileset" class="stretch"></div> -->
			</div>
		</td>
	</tr>
	<tr>
		<td>Tile Width</td>
		<td><input type="number" name="tile_width" value="64"></td>
	</tr>
	<tr>
		<td>Tile Height</td>
		<td><input type="number" name="tile_height" value="64"></td>
	</tr>
	<tr>
		<td>Tile Margin</td>
		<td><input type="number" name="tile_margin" value="0"></td>
	</tr>
	<tr>
		<td><span class="hint" title="If desired, specify a color in HEX or RGB format which will later become transparent.">Tile Alpha</span></td>
		<td><input type="text" name="tile_alpha" value="" maxlength="11" placeholder="hex / rgb"></td>
	</tr>
</table>

<hr>

<input type="button" value="add tileset" id="tilesets_add" class="stretch">